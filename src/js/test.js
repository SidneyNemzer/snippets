import { createStore } from 'redux'
import createEditor from './editor'
import snippetStore from './editor/reducers'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

window.extensionPostMessage = function extensionPostMessage(message) {
  console.log('[Noop] Posting messge:', message)
}

function saveToStorage(key, value, mergeValue) {
  console.log('[Noop] saveToStorage:', {key, value, mergeValue})
  return Promise.resolve()
}

function loadFromStorage(key) {
  console.log('[Noop] loadFromStorage, key:', key)
  if (key) {
    return Promise.resolve(undefined)
  } else {
    return Promise.resolve({})
  }
}

const store = createStore(snippetStore)

createEditor(store)
