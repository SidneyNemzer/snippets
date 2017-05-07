// React is not explicitly used in this file,
// but JSX compiles to React.createElement calls
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

try {
  ReactDOM.render(<App/>, document.getElementById('root'))
} catch (error) {
  // TODO Better error display
  const rootElement = document.getElementById('root')
  rootElement.innerHTML = '<h1>Critical Error!</h1>' +
                          '<p>Sorry, an error occurred :(</p>' +
                          '<p>' + error + '</p>'
  console.error('Snippets: critical error!')
  console.error(error)
}
