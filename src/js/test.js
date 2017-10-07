/* This file starts the editor to allow for interface development
   It simulates panel.js (start editor) and background.js (redux store)
*/

import { createStore } from 'redux'
import rootReducer from './editor/reducers'
import { saved } from './editor/actions'
import createEditor from './editor'

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

const saveStore = (store) => {
  const state = store.getState()
  if (!state.saved) {
    console.log('[Noop] save store:', state)
    store.dispatch(saved())
  }
}

const store = createStore(rootReducer)
store.subscribe(debounce(() => saveStore(store), 1500))

const fakeStore = {
	dispatch: (...args) => {
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
// Simulate react-chrome-redux store
store.dispatch({ type: 'LOADED' })
