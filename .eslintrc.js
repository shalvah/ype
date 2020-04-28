module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module"
    },
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "plugin:@typescript-eslint/recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "rules": {
        "no-await-in-loop": ["warn"],
        "no-case-declarations": ["warn"],
        "no-extra-semi": ["warn"],
        "no-extra-boolean-cast": ["off"],
        "no-inner-declarations": ["off"],
        "no-mixed-spaces-and-tabs": ["off"],
        "no-unused-vars": ["warn"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/ban-ts-ignore": ["off"],
        "@typescript-eslint/no-var-requires": ["off"],
        "@typescript-eslint/no-use-before-define": ["off"],
        "@typescript-eslint/member-delimiter-style": ["off"],
        "prefer-const": ["off"],
    }
};