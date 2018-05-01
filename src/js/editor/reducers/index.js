import { combineReducers } from 'redux'
import snippets from './snippets'
import { reducer as settings } from './settings'

export default combineReducers({
  settings,
  snippets
})
