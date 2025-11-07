import { render } from "@react-md/core/test-utils";
import { describe, expect, it, vi } from "vitest";

import { createRequire } from "../createRequire.js";
import { dangerouslyCreateElement } from "../dangerouslyCreateElement.js";

describe("dangerouslyCreateElement", () => {
  it("should return null for empty code", () => {
    expect(dangerouslyCreateElement({ code: "" })).toBe(null);
    expect(dangerouslyCreateElement({ code: "              " })).toBe(null);
  });

  it("should return null for code only using the console", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(dangerouslyCreateElement({ code: "console" })).toBe(null);

    expect(log).not.toHaveBeenCalled();
    expect(
      dangerouslyCreateElement({ code: "console.log('Hello, world!')" })
    ).toBe(null);
    expect(log).toHaveBeenCalledExactlyOnceWith("Hello, world!");
    log.mockRestore();
  });

  it("should throw an error if invalid code is provided", () => {
    expect(() =>
      dangerouslyCreateElement({
        code: `
<>
  <div>{value}</div>
  <div>Hello, world!</div>
</>
`,
      })
    ).toThrow("value is not defined");
  });

  describe("simple rendering", () => {
    it("should support an inline element", () => {
      const element = dangerouslyCreateElement({
        code: `
<>
<div>Hello, world!</div>
</>
`,
      });

      expect(element).toMatchSnapshot();
    });

    it("should support a function component", () => {
      const element = dangerouslyCreateElement({
        code: `
function Example() {
return <div>Hello, world!</div>;
}
`,
      });

      expect(element).toMatchInlineSnapshot(`<Example />`);

      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });

    it("should allow React to be global", () => {
      const element = dangerouslyCreateElement({
        code: `
function Counter() {
const [count, setCount] = React.useState(0);

return (
<>
<div>{count}</div>
<button onClick={() => setCount(prev => prev + 1)}>Increment</button>
<button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
</>
);
}
`,
      });

      expect(element).toMatchInlineSnapshot(`<Counter />`);

      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });

    it("should support a class component", () => {
      const element = dangerouslyCreateElement({
        code: `
class Example extends React.Component {
render() {
return <div>Hello, world!</div>;
}
}
`,
      });

      expect(element).toMatchInlineSnapshot(`<Example />`);
      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });

    it("should support unnamed default export arrow functions", () => {
      const element = dangerouslyCreateElement({
        code: `
export default () => <div>Hello, world!</div>
`,
      });
      expect(element).toMatchInlineSnapshot(`<Unknown />`);

      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });
  });

  describe("render function", () => {
    it("should allow the render function to render the code", () => {
      const element = dangerouslyCreateElement({
        code: `
const value = "Hello, world!";

render(
<div>{value}</div>
);
`,
      });

      expect(element).toMatchInlineSnapshot(`
        <div>
          Hello, world!
        </div>
      `);
    });

    it("should override the default export if the render function is used", () => {
      const element = dangerouslyCreateElement({
        code: `
const value = "Hello, world!";

export default function ShouldBeIgnored() {
return <h1>I should be ignored</h1>
}

render(
<div>{value}</div>
);
`,
      });

      expect(element).toMatchInlineSnapshot(`
        <div>
          Hello, world!
        </div>
      `);
    });

    it("should be able to render a string", () => {
      const element = dangerouslyCreateElement({
        code: `render("Hello, world!")`,
      });
      expect(element).toMatchInlineSnapshot(`
        <React.Fragment>
          Hello, world!
        </React.Fragment>
      `);
    });
  });

  describe("scope", () => {
    it("should ignore the default keyword since it is used internally", () => {
      const element = dangerouslyCreateElement({
        code: "",
        scope: {
          default: "Hello!",
        },
      });
      expect(element).toMatchInlineSnapshot(`null`);
    });

    it("should support global declarations", () => {
      const element = dangerouslyCreateElement({
        code: `
<>
  <div>{value}</div>
</>
`,
        scope: {
          value: "Hello, world!",
        },
      });

      expect(element).toMatchInlineSnapshot(`
        <React.Fragment>
          <div>
            Hello, world!
          </div>
        </React.Fragment>
      `);
    });

    it("should allow for custom relative imports", () => {
      const Example = () => <>Example Import</>;

      const element = dangerouslyCreateElement({
        code: `import Example from "./Example";

render(<Example />);
`,
        scope: {
          import: {
            "./Example": Example,
          },
        },
      });

      expect(element).toMatchInlineSnapshot(`<Example />`);
      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });

    it("should allow for custom imports", () => {
      const Example = () => <>Example Import</>;

      const element = dangerouslyCreateElement({
        code: `import Example from "Example";

render(<Example />);
`,
        scope: {
          import: {
            Example,
          },
        },
      });

      expect(element).toMatchInlineSnapshot(`<Example />`);
      const { container } = render(element);
      expect(container).toMatchSnapshot();
    });

    it("should throw an error if an import cannot be found", () => {
      expect(() =>
        dangerouslyCreateElement({
          code: `import Example from 'example';
render(<Example  />);
`,
        })
      ).toThrow("Module not found: example");
    });

    it("should support fake css modules out of the box", () => {
      const code = `import styles from "./example.module.css";

render(<div className={styles.container}>Hello, world!</div>);
`;

      const element = dangerouslyCreateElement({ code });
      expect(element).toMatchInlineSnapshot(`
        <div
          className="example_container__ZXhhb"
        >
          Hello, world!
        </div>
      `);
    });

    it("should support fake scss modules out of the box", () => {
      const code = `import styles from "./example.module.scss";

render(<div className={styles.container}>Hello, world!</div>);
`;

      const element = dangerouslyCreateElement({ code });
      expect(element).toMatchInlineSnapshot(`
        <div
          className="example_container__ZXhhb"
        >
          Hello, world!
        </div>
      `);
    });

    it("should allow for the import behavior to be overridden with a require function", () => {
      const element = dangerouslyCreateElement({
        code: `
import styles from "./Example.module.scss";

render(<div className={styles.example}>Example</div>);
`,
        scope: {
          require: createRequire({
            imports: {
              "./Example.module.scss": {},
            },
            getDynamicModule: () => {},
          }),
        },
      });

      expect(element).toMatchInlineSnapshot(`
        <div>
          Example
        </div>
      `);
    });
  });
});
