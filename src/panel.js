import Logger from './logger'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

class PanelConsole {
  log(input) {
    evalInWindow('console.log("' + input + '")')
  }
}

const logger = new Logger('panel', new PanelConsole())

logger.log('sub b')
