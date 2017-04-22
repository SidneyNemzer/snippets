import Logger from './logger'
import React from 'react'
import { render } from 'react-dom'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'

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

  render(
    <AceEditor
      mode="javascript"
      onChange={newValue => logger.log(newValue)}
      name="editor"
    />,
    document.getElementById('root')
  )

} catch (exception) {
  // TODO Switch to logger.error when error is implemented in logger
  logger.log('Error!')
  logger.log(exception)
}
