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
 * @return {undefined}
 */
function saveToStorage(key, value, mergeValue) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(null, function (storage) {
      const previousValue = storage[key]
    })
  })
}

/**
 * Retrieves data from Chrome's sync storage
 * @param  {string} key The key which references 
 * @return {[type]}     [description]
 */
function loadFromStorage(key) {

}

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
