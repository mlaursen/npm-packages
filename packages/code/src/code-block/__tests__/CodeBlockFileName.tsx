import { render } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { CodeBlockFileName } from "../CodeBlockFileName.js";

describe("CodeBlockFileName", () => {
  it("should render witht he correct defaults", () => {
    const { container } = render(
      <CodeBlockFileName>CodeBlock.tsx</CodeBlockFileName>
    );

    expect(container).toMatchSnapshot();
  });
});
