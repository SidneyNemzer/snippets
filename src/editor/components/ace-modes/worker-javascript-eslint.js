import eslint from 'eslint/lib/linter/linter'
import './worker'

const linter = new eslint.Linter()

require('ace-builds')

// copied from ace/worker/mirror.js
// this module does not appear in `ace-builds` in a stand-alone format (it's
// compiled into other modules) so we just copy the source here.
ace.define("ace/worker/mirror", function(require, exports, module) {
  "use strict";
  var Document = require("../document").Document;
  var lang = require("../lib/lang");

  var Mirror = exports.Mirror = function(sender) {
      this.sender = sender;
      var doc = this.doc = new Document("");

      var deferredUpdate = this.deferredUpdate = lang.delayedCall(this.onUpdate.bind(this));

      var _self = this;
      sender.on("change", function(e) {
          var data = e.data;
          if (data[0].start) {
              doc.applyDeltas(data);
          } else {
              for (var i = 0; i < data.length; i += 2) {
                  if (Array.isArray(data[i+1])) {
                      var d = {action: "insert", start: data[i], lines: data[i+1]};
                  } else {
                      var d = {action: "remove", start: data[i], end: data[i+1]};
                  }
                  doc.applyDelta(d, true);
              }
          }
          if (_self.$timeout)
              return deferredUpdate.schedule(_self.$timeout);
          _self.onUpdate();
      });
  };

  (function() {
      this.$timeout = 500;

      this.setTimeout = function(timeout) {
          this.$timeout = timeout;
      };

      this.setValue = function(value) {
          this.doc.setValue(value);
          this.deferredUpdate.schedule(this.$timeout);
      };

      this.getValue = function(callbackId) {
          this.sender.callback(this.doc.getValue(), callbackId);
      };

      this.onUpdate = function() {
          // abstract method
      };

      this.isPending = function() {
          return this.deferredUpdate.isPending();
      };
  }).call(Mirror.prototype);
});

ace.define('ace/mode/javascript_worker_eslint', function(require, exports, module) {
  console.log('ace.define(javascript_worker_eslint)')
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
              sourceType: 'script',
              ecmaFeatures: {},
              env: { browser: true }
            }
        };
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        console.log('onUpdate')
        var value = this.doc.getValue();

        if (!value) {
            return this.sender.emit("annotate", []);
        }

        // ESLint usage is based on
        // https://github.com/eslint/website/blob/5a3ffe7e67eca55675b6e30029891da9098c1e6c/src/js/demo/components/App.jsx

        let messages = []

        try {
          messages = linter.verify(value, this.options, { fix: false })
        } catch (error) {
          messages = [{
            row: 0,
            column: 0,
            text: `An error occured while linting:\n${error.stack}`,
            type: 'error'
          }]
        }

        // eslint message properties
        // https://eslint.org/docs/developer-guide/nodejs-api#linter
        // column - the column on which the error occurred.
        // fatal - usually omitted, but will be set to true if there's a parsing error (not related to a rule).
        // line - the line on which the error occurred.
        // message - the message that should be output.
        // nodeType - the node or token type that was reported with the problem.
        // ruleId - the ID of the rule that triggered the messages (or null if fatal is true).
        // severity - either 1 or 2, depending on your configuration.
        // endColumn - the end column of the range on which the error occurred (this property is omitted if it's not range).
        // endLine - the end line of the range on which the error occurred (this property is omitted if it's not range).
        // fix - an object describing the fix for the problem (this property is omitted if no fix is available).
        // suggestions - an array of objects describing possible lint fixes for editors to programmatically enable (see details in the Working with Rules docs).

        const annotations = []

        for (var i = 0; i < messages.length; i++) {
            const message = messages[i]
            annotations.push({
                row: message.line - 1,
                column: message.column - 1,
                text: message.message,
                type: message.severity === 1 ? 'warning' : 'error'
            });
        }

        this.sender.emit("annotate", annotations);
    };
  }).call(JavaScriptWorkerEslint.prototype);

  exports.JavaScriptWorkerEslint = JavaScriptWorkerEslint;
});
