import "@react-md/core/test-utils/data-testid";
import "@react-md/core/test-utils/polyfills";
import "@react-md/core/test-utils/vitest/setup";
import { configure } from "@testing-library/react";
import { beforeAll, vi } from "vitest";

beforeAll(() => {
  // @ts-expect-error This is a hacky workaround to fix the fake timers with testing-library/user-event
  globalThis.jest = vi;
});

configure({ reactStrictMode: true });
