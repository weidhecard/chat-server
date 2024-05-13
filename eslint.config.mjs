// eslint.config.js
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: ["storage/backup/*"],
        rules: {
            "no-unused-vars": "off",
            "no-undef": "off",
        },
    },
];
