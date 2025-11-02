import { describe, expect, it } from "vitest";

import { render } from "@/test-utils";

import HomePage from "../page";

describe("HomePage", () => {
  it("should render correctly", () => {
    const { container } = render(<HomePage />);

    expect(container).toMatchSnapshot();
  });
});
