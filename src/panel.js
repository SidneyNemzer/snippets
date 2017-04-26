import Logger from 'logger'

import ReactDOM from 'react-dom'
import App from './components/App'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

const logger = new Logger('panel')
logger.debug('Initializing...')

// TODO Display a loading icon in the list while stuff is loading
const snippets = chrome.storage.local.get('snippets', function (snippets) {
  ReactDOM.render(
    <App
      snippets=snippets
    />,
    document.getElementById('root')
  )
})
