import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
			"indent": ["error", "tab"],
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
];
