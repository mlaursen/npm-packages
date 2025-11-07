import { render, screen } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "../CodeBlock.js";

describe("CodeBlock", () => {
  it("should expect a code element as children and pass props to the root", () => {
    const { rerender } = render(
      <CodeBlock data-testid="container">
        <code>I am code!</code>
      </CodeBlock>
    );

    const container = screen.getByTestId("container");
    expect(container).toMatchSnapshot();

    rerender(
      <CodeBlock
        data-testid="container"
        style={{ color: "red" }}
        className="custom-class-name"
      >
        <code>I am code!</code>
      </CodeBlock>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render all the wrappers and allow props to be passed", () => {
    render(
      <CodeBlock
        data-testid="container"
        style={{ margin: "0 auto" }}
        className="container"
        preProps={{
          "data-testid": "pre",
          style: { fontSize: "3rem" },
          className: "pre",
        }}
        preContainerProps={{
          "data-testid": "pre-container",
          style: { fontWeight: "bold" },
          className: "preContainer",
        }}
        scrollContainerProps={{
          "data-testid": "scroll-container",
          style: { color: "#000" },
          className: "scrollContainer",
        }}
      >
        <code>This is some code</code>
      </CodeBlock>
    );

    const container = screen.getByTestId("container");
    const pre = screen.getByTestId("pre");
    const preContainer = screen.getByTestId("pre-container");
    const scrollContainer = screen.getByTestId("scroll-container");

    expect(container).toHaveStyle({ margin: "0 auto" });
    expect(container).toHaveClass("container");
    expect(pre).toBeInstanceOf(HTMLPreElement);
    expect(pre).toHaveStyle({ fontSize: "3rem" });
    expect(pre).toHaveClass("pre");
    expect(preContainer).toHaveStyle({ fontWeight: "bold" });
    expect(preContainer).toHaveClass("preContainer");
    expect(scrollContainer).toHaveStyle({ color: "#000" });
    expect(scrollContainer).toHaveClass("scrollContainer");
    expect(container).toMatchSnapshot();
  });

  it("should allow an element to be placed after the pre and after the scroll containers", () => {
    render(
      <CodeBlock
        data-testid="container"
        fixedChildren={<span data-testid="fixed" />}
        afterPreElement={<span data-testid="afterPre" />}
        preProps={{ "data-testid": "pre" }}
        scrollContainerProps={{ "data-testid": "scrollContainer" }}
      >
        <code>I am code!</code>
      </CodeBlock>
    );

    const container = screen.getByTestId("container");
    const scrollContainer = screen.getByTestId("scrollContainer");
    const pre = screen.getByTestId("pre");
    const fixed = screen.getByTestId("fixed");
    const afterPre = screen.getByTestId("afterPre");

    expect(scrollContainer.nextElementSibling).toBe(fixed);
    expect(pre.nextElementSibling).toBe(afterPre);
    expect(container).toMatchSnapshot();
  });
});
