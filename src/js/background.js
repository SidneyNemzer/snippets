/* global chrome */
import * as R from 'ramda'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { wrapStore, alias } from 'react-chrome-redux'
import settingsMiddleware from './editor/middleware/settings'
import saveMiddleware from './editor/middleware/save-when-inactive'
import errorMiddleware from './editor/middleware/log-error'
import { defaultState as defaultSettings } from './editor/reducers/settings'
import rootReducer from './editor/reducers'
import createAliases from './editor/aliases'
import Octokit from '@octokit/rest'

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
        const mergedValue = R.mergeDeepRight(oldStorage, newStorage)
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

// TODO the interaction between octokit and the store is weird, can we untangle
// this somehow?
let store
const octokit = new Octokit({
  userAgent: 'snippets',
  auth: () => store.getState().settings.accessToken
})

chromeSyncStorageGet()
  .then(storage => {
    console.log('loaded storage:', storage)
    store = createStore(
      rootReducer,
      {
        settings: Object.assign(defaultSettings, storage.settings)
      },
      applyMiddleware(
        alias(createAliases(octokit)),
        thunk,
        errorMiddleware,
        settingsMiddleware(settingsStorage),
        saveMiddleware
      )
    )
    wrapStore(store, { portName: 'SNIPPETS' })
  })
