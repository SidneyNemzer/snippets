import {
  TAB_SIZE,
  AUTO_COMPLETE,
  SOFT_TABS,
  THEME,
  LINE_WRAP,
  LINTER,
  ACCESS_TOKEN,
  GIST_ID
} from '../actions/settings'

/* This middleware handles saving settings to the current environement's
   storage. In Chrome, this is chrome.storage.sync. In the browser test page,
   it's localStorage
 */

const settingActions = {
  [TAB_SIZE]: 'size',
  [AUTO_COMPLETE]: 'shouldAutoComplete',
  [SOFT_TABS]: 'useSoftTabs',
  [THEME]: 'theme',
  [LINE_WRAP]: 'lineWrap',
  [LINTER]: 'linter',
  [ACCESS_TOKEN]: 'accessToken',
  [GIST_ID]: 'gistId'
}

const isSettingAction = action =>
  Object.keys(settingActions).includes(action.type)

const settingActionPayload = action =>
  action[settingActions[action.type]]

export default storage => store => next => action => {
  if (isSettingAction(action)) {
    storage.set(action.type, settingActionPayload(action))
  }
  next(action)
}
