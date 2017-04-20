import Logger from './logger'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

console.log('(native console) hello from panel')

evalInWindow('console.log("hello from panel")')

try {
class PanelConsole {
  log(input) {
    evalInWindow('console.log("' + input + '")')
  }
}

const logger = new Logger('panel', new PanelConsole())

logger.log('Testing')
} catch(e) {
  evalInWindow('console.log("Error in panel :(")')
  const err = JSON.stringify(e)
  evalInWindow(`console.log("${err}")`)
  console.log(e)
}
