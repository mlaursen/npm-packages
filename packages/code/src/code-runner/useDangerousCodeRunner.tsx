"use client";

import { type ReactElement, useEffect, useRef, useState } from "react";

import { DangerousCodeRunner } from "./DangerousCodeRunner.js";
import type {
  DangerouslyRunCodeOptions,
  DangerouslyRunCodeResult,
} from "./types.js";

const noop = (): void => {
  // do nothing
};

/**
 * This hook can be used to attempt to render a code string as a React
 * component.
 *
 * @example Simple Example (Raw String)
 * ```tsx
 * import { Button } from "@react-md/core/button/Button";
 *
 * export default function ButtonExample() {
 *   return <Button>Hello, world!</Button>;
 * }
 * ```
 *
 * @example Simple Example Usage
 * ```tsx
 * import { CodePreview } from "@mlaursen/code/code-preview/CodePreview";
 * import { useDangerousCodeRunner } from "@mlaursen/code/code-runner/useDangerousCodeRunner";
 * import { Button } from "@react-md/core/button/Button";
 *
 * function Example() {
 *   const { error, element } = useDangerousCodeRunner({
 *     code, // This is the Simple Example (Raw String)
 *
 *     scope: {
 *       imports: {
 *         // since the code imported the `Button` component, it **must** be
 *         // provided in the import scope
 *         Button,
 *       },
 *     },
 *   });
 *
 *   // The `CodePreview` component is optional. It just has some nice styles
 *   // and defaults for generating docs
 *   return (
 *     <CodePreview error={error?.message}>
 *       {element}
 *     </CodePreview>
 *   );
 * }
 * ```
 *
 * @see https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
 * This is pretty much everything from there except using the new JSX transform
 * and I wanted to understand why things were implemented the way they were
 */
export function useDangerousCodeRunner(
  options: DangerouslyRunCodeOptions
): DangerouslyRunCodeResult {
  const { code, scope, onRendered = noop } = options;
  const elementRef = useRef<ReactElement | null>(null);
  const prevCode = useRef(code);
  const prevScope = useRef(scope);

  const [state, setState] = useState<DangerouslyRunCodeResult>(() => {
    const element = (
      <DangerousCodeRunner
        code={code}
        scope={scope}
        onRendered={(error) => {
          onRendered(error);

          if (error) {
            // eslint-disable-next-line react-hooks/immutability
            setState({
              error,
              element: elementRef.current,
            });
          } else {
            elementRef.current = element;
          }
        }}
      />
    );
    return {
      error: null,
      element,
    };
  });

  useEffect(() => {
    if (prevCode.current === code && prevScope.current === scope) {
      return;
    }

    prevCode.current = code;
    prevScope.current = scope;

    const element = (
      <DangerousCodeRunner
        code={code}
        scope={scope}
        onRendered={(error) => {
          onRendered(error);

          if (error) {
            setState({
              error,
              element: elementRef.current,
            });
          } else {
            elementRef.current = element;
          }
        }}
      />
    );

    setState({ error: null, element });
  }, [code, onRendered, scope]);

  return state;
}
