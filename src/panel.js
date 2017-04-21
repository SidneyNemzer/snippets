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

logger.log('Initializing...')

try {
ace.edit('editor')

} catch (exception) {
  // TODO Switch to logger.error when error is implemented in logger
  logger.log('Error!')
  logger.log(exception)
}
