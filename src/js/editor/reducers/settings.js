import { generateReducer } from '../util/generate-redux'
import { types } from '../actions/settings'

export const defaultState = {
  [types.tabSize]: 2,
  [types.autoComplete]: true,
  [types.softTabs]: true,
  [types.theme]: 'github',
  [types.lineWrap]: false,
  [types.linter]: true,
  [types.accessToken]: false,
  [types.gistId]: false,
  [types.autosaveTimer]: 5
}

export const reducer = generateReducer(defaultState)
