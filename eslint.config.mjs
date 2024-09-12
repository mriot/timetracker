// @ts-check

/* eslint-disable @typescript-eslint/no-unsafe-argument */

import eslint from "@eslint/js";
import eslintPluginSvelte from "eslint-plugin-svelte";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...eslintPluginSvelte.configs["flat/prettier"],

    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.url,
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-definitions": ["warn", "type"], // type vs interface
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "off",
            // "@typescript-eslint/no-inferrable-types": "off",
        },
    }
);
