import Logger from 'logger'

import ReactDOM from 'react-dom'
import App from './components/App'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

const logger = new Logger('panel')
logger.debug('Initializing...')

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
