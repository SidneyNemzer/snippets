import { createStore } from 'redux'
import { wrapStore } from 'react-chrome-redux'
import { saved, saveFailed } from './editor/actions'
import rootReducer from './editor/reducers'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		};
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow)
      func.apply(context, args)
	}
}

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
						if (chrome.runtime.lastError) {
							reject(chrome.runtime.lastError)
						} else {
	            resolve()
						}
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
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError)
					} else {
						resolve()
					}
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

const saveStore = (store) => {
  const state = store.getState()
  if (!state.saved) {
    const copyState = Object.assign({}, state)
    delete copyState.saved
    saveToStorage(undefined, copyState, true)
      .then(() => {
        store.dispatch(saved())
      })
			.catch(error => {
				console.error('Error while saving:', error)
				if (error.message === 'QUOTA_BYTES_PER_ITEM quota exceeded')
					store.dispatch(saveFailed('Storage limit exceeded! Click for more info', 'https://github.com/SidneyNemzer/snippets#warning'))
				else
					store.dispatch(saveFailed('An unknown error occurred while saving: ' + error.message))
			})
  }
}

loadFromStorage()
  .then(result => {
		console.log('loaded data:', result)
		if (result.snippets) {
			Object.entries(result.snippets).forEach(([id, value]) => {
				const { content, body } = value
				if (content && typeof body === 'undefined') {
					result.snippets[id].body = content
				}
			})
		}
		console.log('proccessed data:', result)
    const store = createStore(rootReducer, result)
    wrapStore(store, {portName: 'SNIPPETS'})

    store.subscribe(debounce(() => saveStore(store), 1500))
  })
