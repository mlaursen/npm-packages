import { type Linter } from "eslint";
import { BASE_NAME, JSX_FILES } from "./constants.js";

export const mui: Linter.Config[] = [
  {
    name: `${BASE_NAME}/material-ui`,
    files: JSX_FILES,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          // https://mui.com/material-ui/guides/minimizing-bundle-size/#enforce-best-practices-with-eslint
          patterns: [{ regex: "^@mui/(?!(x-|utils))[^/]+$" }],
        },
      ],
    },
  },
];
