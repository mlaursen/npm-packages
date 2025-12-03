// https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
// This is pretty much everything from there except using the new JSX transform
// and I wanted to understand why things were implemented the way they were
import { Component, type ReactElement } from "react";

import { dangerouslyCreateElement } from "./dangerouslyCreateElement.js";
import type {
  DangerouslyEvalCodeOptions,
  DangerouslyRunCodeRenderedOptions,
  DangerouslyRunCodeResult,
  RunnableCodeScope,
} from "./types.js";

export interface DangerousCodeRunnerProps
  extends
    DangerouslyEvalCodeOptions,
    Required<DangerouslyRunCodeRenderedOptions> {}

export interface DangerousCodeRunnerState extends DangerouslyRunCodeResult {
  prevCode: string;
  prevScope?: RunnableCodeScope;
}

export class DangerousCodeRunner extends Component<
  DangerousCodeRunnerProps,
  DangerousCodeRunnerState
> {
  constructor(props: DangerousCodeRunnerProps) {
    super(props);

    this.state = {
      error: null,
      element: null,
      prevCode: "",
    };
  }

  static getDerivedStateFromProps(
    nextProps: DangerousCodeRunnerProps,
    prevState: DangerousCodeRunnerState
  ): DangerousCodeRunnerState | null {
    const { code, scope } = nextProps;
    if (prevState.prevCode === code && prevState.prevScope === scope) {
      return null;
    }

    try {
      return {
        error: null,
        element: dangerouslyCreateElement({ code, scope }),
        prevCode: code,
        prevScope: scope,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
        element: null,
        prevCode: code,
        prevScope: scope,
      };
    }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<DangerousCodeRunnerState> {
    return { error };
  }

  // Note: This is different than the react-runner and was added so that errors
  // show up immediately if the demo code is broken
  override componentDidMount(): void {
    this.props.onRendered(this.state.error);
  }

  override componentDidUpdate(): void {
    this.props.onRendered(this.state.error);
  }

  override render(): ReactElement | null {
    return this.state.error ? null : this.state.element;
  }
}
