import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  SAVING_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
  saveSnippets
} from '../actions/snippets'

const modifyActions = [
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  LOADED_LEGACY_SNIPPETS
]

let saveDelay = 5 * 1000
let timer = null

const restartSaveTimer = save => {
  clearTimeout(timer)
  timer = setTimeout(save, saveDelay)
}

const stopSaveTimer = () => {
  clearTimeout(timer)
  timer = null
}

export default store => next => action => {
  if (modifyActions.includes(action.type)) {
    restartSaveTimer(() => store.dispatch(saveSnippets()))
  } else if (action.type === SAVING_SNIPPETS) {
    stopSaveTimer()
  }
  next(action)
}
