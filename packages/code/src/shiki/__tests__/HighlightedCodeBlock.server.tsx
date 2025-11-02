/* eslint-disable testing-library/render-result-naming-convention */
/** @vitest-environment node */
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HighlightedCodeBlock } from "../HighlightedCodeBlock.server.js";

describe("HighlightedCodeBlock", () => {
  it("should be able to highlight code", async () => {
    const stream = await renderToReadableStream(
      <HighlightedCodeBlock
        lang="tsx"
        code={`
const x = 3;
const y = "hello";
`}
      />
    );

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    let html = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      html += decoder.decode(value, { stream: true });
    }

    expect(html).toMatchSnapshot();
  });
});
