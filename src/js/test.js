import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import ErrorPage from './components/ErrorPage'

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
  ReactDOM.render(
    <ErrorPage
      title="Error"
      message="Something's not working :("
      error={error.toString()}
      action="If this happens again, report it here:"
      link="https://github.com/SidneyNemzer/snippets/issues"
    />,
    document.getElementById('root')
  )
  console.error(error)
}
