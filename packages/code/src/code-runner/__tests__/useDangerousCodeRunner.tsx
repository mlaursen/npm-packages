import { fireEvent, render, screen } from "@react-md/core/test-utils";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import type { DangerouslyRunCodeOptions } from "../types.js";
import { useDangerousCodeRunner } from "../useDangerousCodeRunner.js";

function Example(props: DangerouslyRunCodeOptions): ReactElement {
  const { error, element } = useDangerousCodeRunner(props);
  return (
    <div data-testid="container">
      <div data-testid="error">{error?.message}</div>
      <div data-testid="element">{element}</div>
    </div>
  );
}

function setup(props: DangerouslyRunCodeOptions) {
  const { rerender } = render(<Example {...props} />);

  const container = screen.getByTestId("container");
  const error = screen.getByTestId("error");
  const element = screen.getByTestId("element");

  return {
    error,
    element,
    container,
    rerender: (props: DangerouslyRunCodeOptions) =>
      rerender(<Example {...props} />),
  };
}

describe("useDangerousCodeRunner", () => {
  it("should be able to render valid react code", () => {
    const { error, element, container } = setup({
      code: `
<>
  <div>Hello, world!</div>
</>
`,
    });

    expect(error).toBeEmptyDOMElement();
    expect(element).toHaveTextContent("Hello, world!");
    expect(container).toMatchSnapshot();
  });

  it("should be able to render errors without crashing", () => {
    const { error, element } = setup({
      code: `
<>{value}</>
`,
    });

    expect(error).toHaveTextContent("value is not defined");
    expect(element).toBeEmptyDOMElement();
  });

  it("should be able to handle errors after rerendering by displaying the previous successful element render", () => {
    const { error, element, rerender } = setup({
      code: `
<>Hello, world!</>
`,
    });

    expect(error).toBeEmptyDOMElement();
    expect(element).toHaveTextContent("Hello, world!");

    rerender({
      code: `
<>{value}</>
`,
    });

    expect(error).toBeInTheDocument();
    expect(element).toBeInTheDocument();
    expect(error).toHaveTextContent("value is not defined");
    expect(element).toHaveTextContent("Hello, world!");
  });

  it("should capture runtime **render** errors", () => {
    const { error } = setup({
      code: `
import { useEffect, useState } from "react";

export default function Example() {
  const [error, setError] = useState(false);
  if (error) {
    throw new Error("Something broke!")
  }

  return <button onClick={() => setError(true)}>Button</button>
}

`,
    });

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const button = screen.getByRole("button", { name: "Button" });
    //
    // await waitFor(() => {
    //
    // })

    fireEvent.click(button);
    expect(consoleError).toHaveBeenCalledTimes(1);
    // expect(() => {
    // }).toThrow();
    expect(error).toHaveTextContent("Something broke!");
  });
});
