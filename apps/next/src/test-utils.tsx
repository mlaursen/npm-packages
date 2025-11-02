import {
  type Queries,
  type RenderOptions,
  type RenderResult,
  render as baseRender,
  type queries,
} from "@react-md/core/test-utils";
import { Fragment, type ReactElement } from "react";

import { RootProviders } from "@/components/RootProviders";

export * from "@react-md/core/test-utils";
export * from "@react-md/core/test-utils/vitest";

export function render<
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: ReactElement,
  options: RenderOptions<Q, Container, BaseElement> = {}
): RenderResult<Q, Container, BaseElement> {
  const { wrapper: Wrapper = Fragment, ...renderOptions } = options;

  return baseRender(ui, {
    ...renderOptions,
    wrapper: function TestWrapper({ children }) {
      return (
        <RootProviders>
          <Wrapper>{children}</Wrapper>
        </RootProviders>
      );
    },
  });
}
