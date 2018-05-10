/* global chrome */
import createEditor from './editor'

const logInInspected = (level, message) => {
  chrome.devtools.inspectedWindow.eval(
    `console.${level}(${JSON.stringify(message)})`
  )
}

const evalInInspected = content => {
  chrome.devtools.inspectedWindow.eval(content, {}, (result, exceptionInfo) => {
    if (exceptionInfo.isException && exceptionInfo.value) {
      logInInspected('error', exceptionInfo.value)
    }
  })
}

createEditor(evalInInspected)
