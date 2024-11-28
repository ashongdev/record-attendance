import globals from "globals";

export default {
	ignorePatterns: ["dist"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
	],
	overrides: [
		{
			files: ["**/*.{ts,tsx}"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
			plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
			rules: {
				"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
				"@typescript-eslint/no-unused-vars": "off",
			},
		},
	],
	globals: {
		...globals.browser,
	},
};
