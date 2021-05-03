/* global ace */

import "./worker"; // defines globals like `window`
import "ace-builds"; // defines all ace modules with `ace.define`
import "./mirror"; // defines `ace/worker/mirror` which is not used by the main ace script

// ESLint usage is based on the official demo
// https://github.com/eslint/website/blob/5a3ffe7e67eca55675b6e30029891da9098c1e6c/src/js/demo/components/App.jsx

import eslint from "eslint/lib/linter/linter";

const linter = new eslint.Linter();

// ESLint allows rules to be 'warning' or 'error' but Ace also has 'info',
// this object defines the type of each rule. These are subjective but
// generally errors are more likely to indicate a problem. Rules like
// `no-undef` normally indicate an error but Snippets are likely to depend on
// values defined in the page.
const ruleAnnotationType = {
  "no-dupe-args": "warning",
  "no-dupe-else-if": "warning",
  "no-dupe-keys": "warning",
  "no-duplicate-case": "warning",
  "no-template-curly-in-string": "warning",
  "no-unexpected-multiline": "error",
  "use-isnan": "error",
  "valid-typeof": "warning",
  "no-new-wrappers": "warning",
  "no-undef": "info",
  "no-unused-vars": "info",
  "no-const-assign": "error",
  "no-dupe-class-members": "warning",
};

ace.define(
  "ace/mode/javascript_worker_eslint",
  function (require, exports, module) {
    const oop = require("ace/lib/oop");
    const Mirror = require("ace/worker/mirror").Mirror;

    const JavaScriptWorkerEslint = function (sender) {
      Mirror.call(this, sender);
      this.setTimeout(500);
      this.setOptions();
    };

    oop.inherits(JavaScriptWorkerEslint, Mirror);

    (function () {
      this.setOptions = function (options) {
        this.options = options || {
          parserOptions: {
            ecmaVersion: "2020",
            sourceType: "script",
          },
          env: { browser: true, es6: true, es2017: true, es2020: true },
          rules: {
            // We define the error level separately so everything is set to
            // 'warning' here (`1`).
            "no-dupe-args": 1,
            "no-dupe-else-if": 1,
            "no-dupe-keys": 1,
            "no-duplicate-case": 1,
            "no-template-curly-in-string": 1,
            "no-unexpected-multiline": 1,
            "use-isnan": 1,
            "valid-typeof": 1,
            "no-new-wrappers": 1,
            "no-undef": 1,
            "no-unused-vars": 1,
            "no-const-assign": 1,
            "no-dupe-class-members": 1,
          },
        };
        this.doc.getValue() && this.deferredUpdate.schedule(100);
      };

      this.changeOptions = function (newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
      };

      this.onUpdate = function () {
        var value = this.doc.getValue();

        if (!value) {
          return this.sender.emit("annotate", []);
        }

        const annotations = [];

        try {
          const messages = linter.verify(value, this.options);

          for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            annotations.push({
              row: message.line - 1,
              column: message.column - 1,
              text: `${message.message}${
                message.ruleId ? `\n${message.ruleId}` : ""
              }`,
              // parsing errors don't have a rule ID
              type: message.ruleId
                ? ruleAnnotationType[message.ruleId]
                : "error",
            });
          }
        } catch (error) {
          annotations.push({
            row: 0,
            column: 0,
            text: `An error occured while linting:\n${error.stack}`,
            type: "error",
          });
        }

        this.sender.emit("annotate", annotations);
      };
    }.call(JavaScriptWorkerEslint.prototype));

    exports.JavaScriptWorkerEslint = JavaScriptWorkerEslint;
  }
);
