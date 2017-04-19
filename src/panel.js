import Logger from './logger'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}



const logger = new Logger('panel')
