/* global localStorage */

/* This file starts the editor to allow for interface development in a
   regular webpage. It simulates panel.js (start editor) and background.js
   (redux store)
*/

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { alias } from 'webext-redux'
import rootReducer from './editor/reducers'
import { types } from './editor/actions/settings'
import { defaultState as defaultSettings } from './editor/reducers/settings'
import createEditor from './editor'
import settingsMiddleware from './editor/middleware/settings'
import saveMiddleware from './editor/middleware/save-when-inactive'
import errorMiddleware from './editor/middleware/log-error'
import createAliases from './editor/aliases'
import Octokit from '@octokit/rest'

const LOCAL_STORAGE_PREFIX = 'snippets-settings:'

const storage = {
  set: (path, data) => {
    localStorage[LOCAL_STORAGE_PREFIX + path] = JSON.stringify(data)
  }
}

// TODO the interaction between octokit and the store is weird, can we untangle
// this somehow?
let store
const octokit = new Octokit({
  userAgent: 'snippets',
  auth: () => store.getState().settings.accessToken
})

store =
  createStore(
    rootReducer,
    {
      settings: Object.assign(
        defaultSettings,
        Object.keys(types)
          .reduce((accum, key) => {
            const storageValue =
              JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX + key))
            accum[key] =
              storageValue === null ? defaultSettings[key] : storageValue
            return accum
          }, {})
      )
    },
    applyMiddleware(
      alias(createAliases(octokit)),
      thunk,
      errorMiddleware,
      settingsMiddleware(storage),
      saveMiddleware,
      createLogger({ collapsed: true })
    )
  )

const fakeStore = {
  dispatch: (...args) => {
    // Delay dispatches to the next tick simulate the asynchronous updates in
    // webext-redux
    setTimeout(() => {
      store.dispatch(...args)
    }, 0)
  }
}

createEditor(
  // eslint-disable-next-line no-eval
  eval,
  new Proxy(
    store,
    {
      get: (target, key) => {
        if (key === 'dispatch') {
          return fakeStore.dispatch
        } else {
          return target[key]
        }
      }
    }
  )
)
// Simulate webext-redux store load event
store.dispatch({ type: 'LOADED' })
