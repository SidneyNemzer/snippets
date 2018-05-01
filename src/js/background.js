/* global chrome */
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { wrapStore, alias } from 'react-chrome-redux'
import settingsMiddleware from './editor/middleware/settings'
import saveMiddleware from './editor/middleware/save-when-inactive'
import { defaultState as defaultSettings } from './editor/reducers/settings'
import rootReducer from './editor/reducers'
import aliases from './editor/aliases'

const chromeSyncStorageGet = () =>
  new Promise(resolve => {
    chrome.storage.sync.get(storage => {
      resolve(storage)
    })
  })

const chromeSyncStorageSetMerge = newStorage =>
  chromeSyncStorageGet()
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

const settingsStorage = {
  set: (key, data) =>
    chromeSyncStorageSetMerge({
      settings: {
        [key]: data
      }
    })
}

chromeSyncStorageGet()
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
    const store = createStore(
      rootReducer,
      {
        settings: Object.assign(defaultSettings, result.settings)
      },
      applyMiddleware(
        alias(aliases),
        thunk,
        settingsMiddleware(settingsStorage),
        saveMiddleware
      )
    )
    wrapStore(store, { portName: 'SNIPPETS' })
  })
