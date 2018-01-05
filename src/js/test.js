/* global localStorage */

/* This file starts the editor to allow for interface development in a
   regular webpage. It simulates panel.js (start editor) and background.js
   (redux store)
*/

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './editor/reducers'
import { types } from './editor/actions/settings'
import { defaultState as defaultSettings } from './editor/reducers/settings'
import createEditor from './editor'
import settingsMiddleware from './editor/middleware/settings'
import saveMiddleware from './editor/middleware/save-when-inactive'
import { createLogger } from 'redux-logger'

// const debounce = (func, wait, immediate) => {
//   let timeout = null
//   return function (...args) {
//     const context = this
//     const later = () => {
//       timeout = null
//       if (!immediate) {
//         func.apply(context, args)
//       }
//     }
//     const callNow = immediate && !timeout
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//     if (callNow) {
//       func.apply(context, args)
//     }
//   }
// }

const localStoragePrefix = 'snippets-settings:'

const storage = {
  set: (path, data) => {
    localStorage[localStoragePrefix + path] = JSON.stringify(data)
  }
}

const store = createStore(rootReducer, {
  settings: Object.assign(
    defaultSettings,
    Object.keys(types).reduce((accum, key) => {
      const storageValue = JSON.parse(localStorage.getItem(localStoragePrefix + key))
      accum[key] = storageValue === null
        ? defaultSettings[key]
        : storageValue
      return accum
    }, {})
  )
}, applyMiddleware(thunk, settingsMiddleware(storage), saveMiddleware, createLogger({ collapsed: true })))

// store.subscribe(debounce(() => {
//   const state = store.getState()
//   if (state.settings.accessToken !== accessToken) {
//     localStorage[lsAccessTokenKey] = state.settings.accessToken
//     accessToken = state.settings.accessToken
//     console.log('Updated access token in local storage')
//   }
//   if (!state.saved) {
//     console.log('[Noop] save store:', state)
//     store.dispatch(saved())
//   }
// }, 1500))

const fakeStore = {
  dispatch: (...args) => {
    // Delay dispatches by 2 ms to simulate the delay in react-chrome-redux
    setTimeout(() => {
      store.dispatch(...args)
    }, 2)
  }
}

/* eslint-disable no-eval */
createEditor(eval, new Proxy(
  store,
  {
    get: (target, key) => {
      if (key === 'dispatch') {
        return fakeStore.dispatch
      } else {
        return target[key]
      }
    }
  }))
// Simulate react-chrome-redux store load event
store.dispatch({ type: 'LOADED' })
