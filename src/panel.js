import Logger from 'logger'

// React is not explicitly used in this file,
// but JSX compiles to React.createElement calls
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

const logger = new Logger('panel')
logger.debug('Initializing...')

const snippets = {
  1: {
    name: 'snippet 1',
    content: 'console.log(\'hi\')'
  },
  2: {
    name: 'snippet 2',
    content: 'function test() {\n\talert(\'This is a test\')\n}'
  },
  3: {
    name: 'snippet 3',
    content: 'hi'
  }
}

ReactDOM.render(
  <App
    snippets={snippets}
    selectedSnippet={'1'}
  />,
  document.getElementById('root')
)
