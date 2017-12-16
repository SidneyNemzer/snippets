import { combineReducers } from 'redux'
import { SAVED, SAVE_FAILED } from '../actions'
import snippets from './snippets'
import { reducer as settings } from './settings'

const saved = (state = true, action) => {
  switch (action.type) {
    case SAVED:
      return true
    case SAVE_FAILED:
      return {
        reason: action.reason,
        moreInfo: action.moreInfo
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  settings,
  snippets,
  saved
})

const reducer = (state, action) => {
  const newState = rootReducer(state, action)

  if (
    newState !== state
    && action.type !== '@@redux/INIT'
    && action.type !== SAVED
    && action.type !== SAVE_FAILED
  ) {
    newState.saved = false
  }

  return newState
}

export default reducer
