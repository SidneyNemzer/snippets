import createEditor from "./editor";

const logInInspected = (level: string, message: unknown) => {
  chrome.devtools.inspectedWindow.eval(
    `console.${level}(${JSON.stringify(message)})`
  );
};

const evalInInspected = (content: string) => {
  chrome.devtools.inspectedWindow.eval(
    content,
    {},
    (
      result: unknown,
      // exceptionInfo is undefined if an exception was not thrown, but
      // @types/chrome does not reflect this.
      exceptionInfo:
        | chrome.devtools.inspectedWindow.EvaluationExceptionInfo
        | undefined
    ) => {
      if (exceptionInfo?.isException && exceptionInfo.value) {
        logInInspected("error", exceptionInfo.value);
      }
    }
  );
};

createEditor(evalInInspected, String(chrome.devtools.inspectedWindow.tabId));
