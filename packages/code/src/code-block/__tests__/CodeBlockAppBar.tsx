import { render } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { CodeBlockAppBar } from "../CodeBlockAppBar.js";

describe("CodeBlockAppBar", () => {
  it("should render with the correct defaults", () => {
    const { container } = render(<CodeBlockAppBar>Content!</CodeBlockAppBar>);

    expect(container).toMatchSnapshot();
  });
});
