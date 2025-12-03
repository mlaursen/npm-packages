import { render, screen } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { InlineCode } from "../InlineCode.js";

describe("InlineCode", () => {
  it("should render with ticks and as a code element by default", () => {
    render(<InlineCode>pnpm install @mlaursen/code</InlineCode>);

    const code = screen.getByRole("code");
    expect(code).toMatchSnapshot();
  });

  it("should allow ticks to be removed", () => {
    render(<InlineCode disableTicks>pnpm install @mlaursen/code</InlineCode>);

    const code = screen.getByRole("code");
    expect(code).toMatchSnapshot();
  });

  it("should be renderable as a kbd element", () => {
    render(
      <InlineCode as="kbd" data-testid="kbd">
        Enter
      </InlineCode>
    );

    expect(() => screen.getByRole("code")).toThrowError();

    const kbd = screen.getByTestId("kbd");
    expect(kbd).toMatchSnapshot();
  });
});
