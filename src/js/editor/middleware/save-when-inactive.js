import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  saveSnippets
} from '../actions/snippets'

const modifyActions = [
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET
]

const saveDelay = 5 * 1000

const resetSaveTimer = (timer, done) => {
  clearTimeout(timer)
  return setTimeout(done, saveDelay)
}

let timer = null

export default store => next => action => {
  if (modifyActions.includes(action.type)) {
    timer = resetSaveTimer(timer, () => store.dispatch(saveSnippets()))
  }
  next(action)
}
