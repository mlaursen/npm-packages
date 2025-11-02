"use client";

// https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
// This is pretty much everything from there except using the new JSX transform
// and I wanted to understand why things were implemented the way they were
import { type ReactElement, useEffect, useRef, useState } from "react";

import { DangerousCodeRunner } from "./DangerousCodeRunner.js";
import type {
  DangerouslyRunCodeOptions,
  DangerouslyRunCodeResult,
} from "./types.js";

const noop = (): void => {
  // do nothing
};

export function useDangerouslyRunnableCode(
  options: DangerouslyRunCodeOptions
): DangerouslyRunCodeResult {
  const { code, scope, onRendered = noop } = options;
  const elementRef = useRef<ReactElement | null>(null);
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
