import createEditor from './editor'

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
        const previousValue =
          key === undefined
            ? storage
            : storage[key]
        // Merge the old and new values
        const newValue = Object.assign({}, previousValue, value)
        chrome.storage.sync.set(
          key === undefined
            ? newValue
            : {[key]: newValue},
          function() {
            resolve()
        })
      })
    } else {
      const newVal =
        key === undefined
          ? value
          : {[key]: value}
      chrome.storage.sync.set(
        newVal,
        function() {
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
      if (key !== undefined) {
        resolve(storage[key])
      } else {
        resolve(storage)
      }
    })
  })
}

createEditor(loadFromStorage, saveToStorage, chrome.devtools.inspectedWindow.eval)
