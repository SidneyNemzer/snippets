/* global ace */

import './worker' // defines globals like `window`
import 'ace-builds' // defines all ace modules with `ace.define`
import './mirror' // defines `ace/worker/mirror` which is not used by the main ace script

// ESLint usage is based on the official demo
// https://github.com/eslint/website/blob/5a3ffe7e67eca55675b6e30029891da9098c1e6c/src/js/demo/components/App.jsx

import eslint from 'eslint/lib/linter/linter'

const linter = new eslint.Linter()

ace.define('ace/mode/javascript_worker_eslint', function(require, exports, module) {
  const oop = require("ace/lib/oop");
  const Mirror = require("ace/worker/mirror").Mirror

  const JavaScriptWorkerEslint = function (sender) {
    Mirror.call(this, sender)
    this.setTimeout(500)
    this.setOptions()
  }

  oop.inherits(JavaScriptWorkerEslint, Mirror);

  (function() {
    this.setOptions = function(options) {
        this.options = options || {
            parserOptions: {
              ecmaVersion: "2020",
              sourceType: 'script'
            },
            env: { browser: true },
            rules: {
              'no-dupe-args': 1,
              'no-dupe-else-if': 1,
              'no-dupe-keys': 1,
              'no-duplicate-case': 1,
              'no-template-curly-in-string': 1,
              'no-unexpected-multiline': 2,
              'use-isnan': 2,
              'valid-typeof': 2,
              'no-new-wrappers': 1,
              'no-undef': 2,
              'no-unused-vars': 1,
              'no-const-assign': 2,
              'no-dupe-class-members': 1
            }
        };
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        var value = this.doc.getValue();

        if (!value) {
            return this.sender.emit("annotate", []);
        }

        const annotations = []

        try {
            const messages = linter.verify(value, this.options)

            for (let i = 0; i < messages.length; i++) {
                const message = messages[i]
                annotations.push({
                    row: message.line - 1,
                    column: message.column - 1,
                    text: `${message.message}\n${message.ruleId}`,
                    type: message.severity === 1 ? 'warning' : 'error'
                });
            }
        } catch (error) {
          annotations.push({
            row: 0,
            column: 0,
            text: `An error occured while linting:\n${error.stack}`,
            type: 'error'
          })
        }

        this.sender.emit("annotate", annotations);
    };
  }).call(JavaScriptWorkerEslint.prototype);

  exports.JavaScriptWorkerEslint = JavaScriptWorkerEslint;
});
