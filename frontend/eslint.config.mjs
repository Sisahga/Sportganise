import globals from "globals";
import eslint from "@eslint/js";
import typescript from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import testingLibrary from "eslint-plugin-testing-library";
import jest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.browser,
      }
    },
    settings: {
      react: {
        version: "detect",
      }
    }
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  eslint.configs.recommended,
  ...typescript.configs.recommended,
  react.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  jest.configs['flat/recommended'],
  testingLibrary.configs['flat/react'],
];
