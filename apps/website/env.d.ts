// oxlint-disable-next-line unicorn/require-module-specifiers
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI?: "true";
      URL?: string;
      NODE_ENV?: "development" | "production" | "test";
      ENABLE_SSR?: "true";
      DISABLE_FOCUS_ANIMATION?: "true";
      BUILD_DRAFTS?: boolean;
      SHOW_HOME_NAVIGATION?: "true";
    }
  }
}
