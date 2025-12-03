import { render, screen } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { CopyToClipboard } from "../../copy-to-clipboard/CopyToClipboard.js";
import { CodeBlockScrollWrappers } from "../CodeBlockScrollWrappers.js";

describe("CodeBlockScrollWrappers", () => {
  it("should render all the wrappers and allow props to be passed", () => {
    const { rerender } = render(
      <CodeBlockScrollWrappers data-testid="container">
        Hello, world!
      </CodeBlockScrollWrappers>
    );

    const container = screen.getByTestId("container");
    expect(container).toMatchSnapshot();

    rerender(
      <CodeBlockScrollWrappers
        data-testid="container"
        style={{ margin: "0 auto" }}
        className="container"
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
        Hello, world!
      </CodeBlockScrollWrappers>
    );

    const preContainer = screen.getByTestId("pre-container");
    const scrollContainer = screen.getByTestId("scroll-container");

    expect(container).toHaveStyle({ margin: "0 auto" });
    expect(container).toHaveClass("container");
    expect(preContainer).toHaveStyle({ fontWeight: "bold" });
    expect(preContainer).toHaveClass("preContainer");
    expect(scrollContainer).toHaveStyle({ color: "#000" });
    expect(scrollContainer).toHaveClass("scrollContainer");
    expect(container).toMatchSnapshot();
  });

  it("should have built in support to removing the margin top", () => {
    const { rerender } = render(
      <CodeBlockScrollWrappers data-testid="container">
        <div>Hello</div>
      </CodeBlockScrollWrappers>
    );

    const container = screen.getByTestId("container");
    expect(container).not.toHaveClass("code-block--no-mt");

    rerender(
      <CodeBlockScrollWrappers data-testid="container" disableMarginTop>
        <div>Hello</div>
      </CodeBlockScrollWrappers>
    );
    expect(container).toHaveClass("code-block--no-mt");
  });

  it("should allow for fixed children to be placed around the scroll blocks", () => {
    render(
      <CodeBlockScrollWrappers
        data-testid="container"
        fixedChildren={<CopyToClipboard copyText="Hello, world!" />}
      >
        Hello, world!
      </CodeBlockScrollWrappers>
    );

    expect(() =>
      screen.getByRole("button", { name: "Copy" })
    ).not.toThrowError();
    expect(screen.getByTestId("container")).toMatchSnapshot();
  });
});
