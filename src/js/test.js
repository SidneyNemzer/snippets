import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

window.postMessage = function postMessage(message) {
  console.log('[Noop] Posting messge:', message)
}

function saveToStorage(key, value, mergeValue) {
  console.log('[Noop] saveToStorage:', {key, value, mergeValue})
  return Promise.resolve()
}

function loadFromStorage(key) {
  console.log('[Noop] loadFromStorage, key:', key)
  if (key) {
    Promise.resolve(undefined)
  } else {
    Promise.resolve({})
  }
}

try {
  ReactDOM.render(
    <App
      saveToStorage={saveToStorage}
      loadFromStorage={loadFromStorage}
    />,
    document.getElementById('root')
  )
} catch (error) {
  // TODO Better error display
  const rootElement = document.getElementById('root')
  rootElement.innerHTML = '<h1>Critical Error!</h1>' +
                          '<p>Sorry, an error occurred :(</p>' +
                          '<p>' + error + '</p>'
  console.error('Snippets: critical error!')
  console.error(error)
}
