import { render, screen } from "@react-md/core/test-utils";
import { type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { dangerouslyImportCode } from "../dangerouslyImportCode.js";
import type { DangerouslyRunCodeOptions } from "../types.js";
import { useDangerousCodeRunner } from "../useDangerousCodeRunner.js";

function Test(props: DangerouslyRunCodeOptions): ReactElement {
  const { error, element } = useDangerousCodeRunner(props);
  return (
    <div data-testid="container">
      <div data-testid="error">{error?.message}</div>
      <div data-testid="element">{element}</div>
    </div>
  );
}

describe("dangerouslyImportCode", () => {
  it("should be able to import code from strings to support multi-file behavior", () => {
    const file1 = `
export const value = 3;
`;
    const file2 = `
import { useState } from "react";

export function Example({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <div data-testid="value">{value}</div>
      <button onClick={() => setValue(prev => prev + 1)}>Increment</button>
    </>
  );
}
`;

    const main = `
import { value } from "./file1.js";
import { Example } from "./file2.js";

export default function MainExample() {
  return <Example defaultValue={value} />
}
`;

    render(
      <Test
        code={main}
        scope={{
          import: {
            "./file1.js": dangerouslyImportCode(file1),
            "./file2.js": dangerouslyImportCode(file2),
          },
        }}
      />
    );

    const container = screen.getByTestId("container");
    const value = screen.getByTestId("value");
    expect(value).toHaveTextContent("3");
    expect(container).toMatchSnapshot();
  });
});
