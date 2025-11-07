import { render, screen } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { ColorPreview } from "../ColorPreview.js";

describe("ColorPreview", () => {
  it("should render correctly", () => {
    render(<ColorPreview data-testid="color" color="#faf" />);

    const color = screen.getByTestId("color");
    expect(color).toMatchSnapshot();
  });

  it("should ignore children and throw a type error", () => {
    render(
      // @ts-expect-error Children are not allowed
      <ColorPreview color="rgb(255, 12, 32)" data-testid="color">
        Ignored!
      </ColorPreview>
    );

    expect(() => screen.getByText("Ignored!")).toThrow();
    const color = screen.getByTestId("color");
    expect(color).toMatchSnapshot();
  });

  it("should be able to render with an icon's size and without the color text visible", () => {
    render(<ColorPreview data-testid="color" color="#0F0F0F" variant="icon" />);

    const color = screen.getByTestId("color");
    expect(color).toMatchSnapshot();
    // expect(screen.getByText("#0F0F0F")).toHaveClass("rmd-sr-only");
  });
});
