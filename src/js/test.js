import createEditor from './editor'

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

createEditor(loadFromStorage, saveToStorage, eval)
