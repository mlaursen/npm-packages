import { describe, expect, it } from "vitest";

import { tryAddingMissingExportDefault } from "../tryAddingMissingExportDefault.js";

describe("tryAddingMissingExportDefault", () => {
  describe("automatic `export default` prefix to reduce boilerplate", () => {
    it("should prefix to the first jsx declaration", () => {
      expect(tryAddingMissingExportDefault("<>Hello</>")).toBe(
        "export default <>Hello</>"
      );

      expect(
        tryAddingMissingExportDefault(`
<>
<div>Hello, world!</div>
</>
`)
      ).toBe(
        `
export default <>
<div>Hello, world!</div>
</>
`
      );
    });

    it("should prefix the first function declaration", () => {
      expect(
        tryAddingMissingExportDefault(`
function Example() {
  return <div>Hello, world!</div>
}
`)
      ).toBe(`
export default function Example() {
  return <div>Hello, world!</div>
}
`);
    });

    it("should prefix the first class declaration", () => {
      expect(
        tryAddingMissingExportDefault(`
class Example extends React.Component {
  render() {
    return <div>Hello, world!</div>
  }
}
`)
      ).toBe(`
export default class Example extends React.Component {
  render() {
    return <div>Hello, world!</div>
  }
}
`);
    });

    it("should prefix an anonymous function", () => {
      expect(
        tryAddingMissingExportDefault(
          `
() => <div>Hello, world!</div>
`
        )
      ).toBe(`
export default () => <div>Hello, world!</div>
`);
    });

    it("should do nothing if an import exists", () => {
      const code = `
import Container from "./Container";

function Example() {
  return <Container>Hello, world!</Container>
}
`;

      expect(tryAddingMissingExportDefault(code)).toBe(code);
    });

    it("should do nothing if there are any other leading statements", () => {
      const code = `
const value = "Hello, world!";

<>
  <div>{value}</div>
</>
`;

      expect(tryAddingMissingExportDefault(code)).toBe(code);
    });

    it("should not do anything if there is already an export default for the first statement", () => {
      const code1 = `
export default function Example() {
  return <div>Example</div>
}
`;
      const code2 = `
export default class Example extends React.Component {
  render() {
    return <div>Hello, world!</div>
  }
}
`;
      const code4 = `
export default () => <div>Example</div>
`;

      expect(tryAddingMissingExportDefault(code1)).toBe(code1);
      expect(tryAddingMissingExportDefault(code2)).toBe(code2);
      expect(tryAddingMissingExportDefault(code4)).toBe(code4);
    });

    it("should check for an existing export default before injecting so that components don't have to be hoisted", () => {
      expect(
        tryAddingMissingExportDefault(`
function Example() {
  return <div>Example</div>
}

export default function RealExample() {
  return <Example />
}
`)
      ).toBe(`
function Example() {
  return <div>Example</div>
}

export default function RealExample() {
  return <Example />
}
`);
    });
  });
});
