import { combineReducers } from 'redux'
import { SAVED } from '../actions'
import snippets from './snippets'
import settings from './settings'

const saved = (state = true, action) => {
  switch (action.type) {
    case SAVED:
      return true
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

  console.log(action)

  if (newState !== state && action.type !== '@@redux/INIT' && action.type !== SAVED) {
    newState.saved = false
  }

  return newState
}

export default reducer
