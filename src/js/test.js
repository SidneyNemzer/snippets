/* global localStorage */

/* This file starts the editor to allow for interface development in a
   regular webpage. It simulates panel.js (start editor) and background.js
   (redux store)
*/

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './editor/reducers'
import { types } from './editor/actions/settings'
import { defaultState as defaultSettings } from './editor/reducers/settings'
import createEditor from './editor'
import settingsMiddleware from './editor/middleware/settings'
import saveMiddleware from './editor/middleware/save-when-inactive'

const LOCAL_STORAGE_PREFIX = 'snippets-settings:'

const storage = {
  set: (path, data) => {
    localStorage[LOCAL_STORAGE_PREFIX + path] = JSON.stringify(data)
  }
}

const store =
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
      thunk,
      settingsMiddleware(storage),
      saveMiddleware,
      createLogger({ collapsed: true })
    )
  )

const fakeStore = {
  dispatch: (...args) => {
    // Delay dispatches by 2 ms to simulate the delay in react-chrome-redux
    setTimeout(() => {
      store.dispatch(...args)
    }, 2)
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
// Simulate react-chrome-redux store load event
store.dispatch({ type: 'LOADED' })
