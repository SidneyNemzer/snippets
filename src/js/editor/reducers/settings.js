import {
  TAB_SIZE,
  AUTO_COMPLETE,
  SOFT_TABS,
  THEME,
  LINE_WRAP,
  LINTER
} from '../actions/settings'

const defaultState = {
  tabSize: 2,
  autoComplete: true,
  softTabs: true,
  theme: 'github',
  lineWrap: false,
  linter: true
}

const settings = (state = defaultState, action) => {
  switch (action.type) {
    case TAB_SIZE:
      return Object.assign({},
        state,
        {
          tabSize: action.size
        }
      )
    case AUTO_COMPLETE:
      return Object.assign({},
        state,
        {
          autoComplete: action.shouldAutoComplete
        }
      )
    case SOFT_TABS:
      return Object.assign({},
        state,
        {
          softTabs: action.useSoftTabs
        }
      )
    case THEME:
      return Object.assign({},
        state,
        {
          theme: action.theme
        }
      )
    case LINE_WRAP:
      return Object.assign({},
        state,
        {
          lineWrap: action.lineWrap
        }
      )
    case LINTER:
      return Object.assign({},
        state,
        {
          linter: action.linter
        }
      )
    default:
      return state
  }
}

export default settings
