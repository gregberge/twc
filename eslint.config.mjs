import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  {
    name: "twc/global-ignores",
    ignores: ["**/website", "**/dist"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: "twc/custom-ts-rules",
    rules: {
      curly: "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    name: "twc/vitest",
    files: ["**/*.test.?(m)js"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);

export default config;
