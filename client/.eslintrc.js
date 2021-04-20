module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-import",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks",
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
      ],
    "rules": {
        "@typescript-eslint/no-inferrable-types": "off",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "jsdoc/require-jsdoc": "off",
        "max-len": ["error", 200, 2, {
          "ignoreUrls": true,
          "ignoreComments": true,
          "ignoreRegExpLiterals": true,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true
        }],
        "no-prototype-builtins": "off"
    }
};
