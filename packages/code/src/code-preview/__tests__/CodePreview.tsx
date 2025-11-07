import { render, screen } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { CodePreview, type CodePreviewProps } from "../CodePreview.js";

describe("CodePreview", () => {
  it("should render with some sensible defaults and box styling", () => {
    const { rerender } = render(
      <CodePreview data-testid="container">Hello, world!</CodePreview>
    );

    const container = screen.getByTestId("container");
    expect(container).toMatchSnapshot();

    rerender(
      <CodePreview
        data-testid="container"
        style={{ fontWeight: "bold" }}
        className="custom-container"
        justify="start"
        fullWidth
      >
        Hello, world!
      </CodePreview>
    );
    expect(container).toMatchSnapshot();
  });

  it("should be able to render without the box styling", () => {
    render(
      <CodePreview data-testid="container" disableBox>
        Hello, world!
      </CodePreview>
    );

    const container = screen.getByTestId("container");
    expect(container).not.toHaveClass("rmd-box");
    expect(container).toMatchSnapshot();
  });

  it("should render a simple alert if an error is provided", () => {
    const props = {
      "data-testid": "container",
      errorProps: {
        "data-testid": "error",
      },
      children: <span>Hello, world!</span>,
    } satisfies CodePreviewProps;
    const { rerender } = render(<CodePreview {...props} />);

    const container = screen.getByTestId("container");
    expect(() => screen.getByTestId("error")).toThrow();
    expect(container).toMatchSnapshot();

    rerender(<CodePreview {...props} error={<span>Something broke!</span>} />);

    expect(() => screen.getByRole("alert")).not.toThrow();
    expect(() => screen.getByTestId("error")).not.toThrow();
    expect(container).toMatchSnapshot();
  });
});
