// React is not explicitly used in this file,
// but JSX compiles to React.createElement calls
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

/**
 * Save data to Chrome's Sync storage
 * @param  {string} key        A key, which is used to reference this data in the storage
 * @param  {*} value           A value to store
 * @param  {boolean} mergeValue If `value` is an object, setting this to true will keep keys
 *                              from the original value that are unchaned in the new value
 * @return {Promise}            The promise is resolved when the operation has completed
 * @resolves {undefined}        No value is passed
 */
function saveToStorage(key, value, mergeValue) {
  return new Promise(function (resolve, reject) {
    if (mergeValue) {
      // We'll need to retrieve the previous value first
      chrome.storage.sync.get(null, function (storage) {
        const previousValue = storage[key]
        const newValue = Object.assign({}, previousValue, value)
        chrome.storage.sync.set(key, newValue, function() {
          resolve()
        })
      })
    } else {
      chrome.storage.sync.set(key, value, function() {
        resolve()
      })
    }
  })
}

/**
 * Retrieves data from Chrome's sync storage
 * @param   {string}  key   The key to retrieve
 * @returns {Promise}       Resolves when the data has been retrieved
 * @resolves {*}            The value of the key. It may be any value allowed in Chrome storage.
 */
function loadFromStorage(key) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(null, function (storage) {
      resolve(storage[key])
    })
  })
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
