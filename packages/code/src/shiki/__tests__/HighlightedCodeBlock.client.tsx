import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HighlightedCodeBlock } from "../HighlightedCodeBlock.client.js";

describe("HighlightedCodeBlock", () => {
  it("should be able to highlight code", async () => {
    const { container } = render(
      <HighlightedCodeBlock
        lang="tsx"
        code={`
const x = 3;
const y = "hello";
`}
        preWrapperProps={{ "data-testid": "wrapper" }}
      />
    );

    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("data-highlighted", "false");
    expect(wrapper).toHaveAttribute("data-highlighting", "true");
    expect(wrapper).toMatchSnapshot();

    await waitFor(() => {
      expect(wrapper).toHaveAttribute("data-highlighted", "true");
    });

    expect(wrapper).toHaveAttribute("data-highlighting", "false");
    expect(container).toMatchSnapshot();
  });
});
