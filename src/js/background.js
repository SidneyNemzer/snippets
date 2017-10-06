/* global chrome */
import { createStore } from 'redux'
import { wrapStore } from 'react-chrome-redux'
import { saved, saveFailed } from './editor/actions'
import rootReducer from './editor/reducers'

const debounce = (func, wait, immediate) => {
  let timeout = null
  return function (...args) {
    const context = this
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

const getStorage = () =>
  new Promise(resolve => {
    chrome.storage.sync.get(null, storage => {
      resolve(storage)
    })
  })

const saveStorageMerge = (newStorage) =>
  // Retrieve the previous value so we can merge with the new value
  getStorage()
    .then(oldStorage =>
      new Promise((resolve, reject) => {
        const mergedValue = Object.assign({}, oldStorage, newStorage)
        chrome.storage.sync.set(mergedValue, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve()
          }
        })
      })
    )

const saveStore = (store) => {
  const state = store.getState()
  if (!state.saved) {
    const copyState = Object.assign({}, state)
    delete copyState.saved
    saveStorageMerge(copyState)
      .then(() => {
        store.dispatch(saved())
      })
      .catch(error => {
        console.error('Error while saving:', error)
        if (error.message === 'QUOTA_BYTES_PER_ITEM quota exceeded') {
          store.dispatch(saveFailed(
            'Storage limit exceeded! Click for more info',
            'https://github.com/SidneyNemzer/snippets#warning')
          )
        } else {
          store.dispatch(saveFailed('An unknown error occurred while saving: ' + error.message))
        }
      })
  }
}

getStorage()
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
