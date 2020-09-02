/* global ace */

ace.define("ace/mode/javascript-eslint", function (require, exports, module) {
  const oop = require("ace/lib/oop");
  const WorkerClient = require("ace/worker/worker_client").WorkerClient;
  const JavaScriptMode = require("ace/mode/javascript").Mode;

  const Mode = function () {
    JavaScriptMode.call(this);
  };
  oop.inherits(Mode, JavaScriptMode);

  (function () {
    this.createWorker = function (session) {
      var worker = new WorkerClient(
        ["ace"],
        "ace/mode/javascript_worker_eslint",
        "JavaScriptWorkerEslint"
      );
      worker.attachToDocument(session.getDocument());

      worker.on("annotate", function (results) {
        session.setAnnotations(results.data);
      });

      worker.on("terminate", function () {
        session.clearAnnotations();
      });

      return worker;
    };
  }.call(Mode.prototype));

  exports.Mode = Mode;
});

ace.config.setModuleUrl(
  "ace/mode/javascript_worker_eslint",
  "/worker-javascript-eslint.js"
);
