const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    sourceType: "script",
  },

  plugins: ["@typescript-eslint", "import", "react", "react-hooks"],

  globals: {
    chrome: true,
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  // NOTE: When adding rules here, you need to make sure they are compatible with
  // `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
  rules: {
    "dot-location": ["warn", "property"],
    eqeqeq: ["warn", "smart"],
    "new-parens": "warn",
    "no-caller": "warn",
    "no-cond-assign": ["warn", "except-parens"],
    "no-const-assign": "warn",
    "no-control-regex": "warn",
    "no-delete-var": "warn",
    "no-dupe-args": "warn",
    "no-dupe-keys": "warn",
    "no-duplicate-case": "warn",
    "no-empty-character-class": "warn",
    "no-empty-pattern": "warn",
    "no-eval": "warn",
    "no-ex-assign": "warn",
    "no-extend-native": "warn",
    "no-extra-bind": "warn",
    "no-extra-label": "warn",
    "no-fallthrough": "warn",
    "no-func-assign": "warn",
    "no-implied-eval": "warn",
    "no-invalid-regexp": "warn",
    "no-iterator": "warn",
    "no-label-var": "warn",
    "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
    "no-lone-blocks": "warn",
    "no-loop-func": "warn",
    "no-mixed-operators": [
      "warn",
      {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"],
        ],
        allowSamePrecedence: false,
      },
    ],
    "no-multi-str": "warn",
    "no-native-reassign": "warn",
    "no-negated-in-lhs": "warn",
    "no-new-func": "warn",
    "no-new-object": "warn",
    "no-new-symbol": "warn",
    "no-new-wrappers": "warn",
    "no-obj-calls": "warn",
    "no-octal": "warn",
    "no-octal-escape": "warn",
    "no-redeclare": "warn",
    "no-regex-spaces": "warn",
    "no-restricted-syntax": ["warn", "WithStatement"],
    "no-script-url": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-sequences": "warn",
    "no-shadow-restricted-names": "warn",
    "no-sparse-arrays": "warn",
    "no-template-curly-in-string": "warn",
    "no-this-before-super": "warn",
    "no-throw-literal": "warn",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-unreachable": "warn",
    "no-unused-labels": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": [
      "warn",
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    "no-with": "warn",
    "no-whitespace-before-property": "warn",
    "require-yield": "warn",
    "rest-spread-spacing": ["warn", "never"],
    "unicode-bom": ["warn", "never"],
    "use-isnan": "warn",
    "valid-typeof": "warn",
    "no-restricted-properties": [
      "error",
      {
        object: "require",
        property: "ensure",
        message: "Please use import() instead",
      },
      {
        object: "System",
        property: "import",
        message: "Please use import() instead",
      },
    ],
    "getter-return": "warn",
    "no-debugger": "warn",

    // IMPORT

    "import/first": "error",
    "import/no-amd": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/no-extraneous-dependencies": "warn",
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external"],
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
          },
        ],
        "newlines-between": "always",
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: { order: "asc" },
      },
    ],

    // REACT

    "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": "warn",
    "react/jsx-no-target-blank": "warn",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": [
      "warn",
      {
        allowAllCaps: true,
        ignore: [],
      },
    ],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-is-mounted": "warn",
    "react/no-typos": "error",
    "react/require-render-return": "error",
    "react/style-prop-object": "warn",
    "react/jsx-boolean-value": ["warn", "never"],

    // REACT-HOOKS

    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",

    // TYPESCRIPT

    "@typescript-eslint/consistent-type-assertions": "warn",
    "@typescript-eslint/no-array-constructor": "warn",
    "@typescript-eslint/no-use-before-define": [
      "warn",
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false,
      },
    ],
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-useless-constructor": "warn",
    "@typescript-eslint/no-for-in-array": "warn",
    "@typescript-eslint/no-namespace": "warn",
    "@typescript-eslint/prefer-as-const": "warn",
    "@typescript-eslint/no-invalid-this": "error",
  },

  overrides: [
    {
      // Files inside of `src`
      files: ["src/**/*"],
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
      rules: {
        strict: ["warn", "never"],
        // These rules won't work outside of `src` because they require type
        // information, which is only generated for `src`.
        "@typescript-eslint/await-thenable": "warn",
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        // Doesn't seem to understand definition files
        "import/order": "off",
      },
    },
    {
      files: ["src/mode-javascript-eslint/**/*"],
      rules: {
        // Only sees the sub-package.json, and thinks ace-builds is missing
        // when it is actually resolved from the top-level package.json
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
