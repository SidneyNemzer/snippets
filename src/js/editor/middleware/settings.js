import { types } from "../actions/settings";

/* This middleware handles saving settings to the current environement's
   storage. In Chrome, this is chrome.storage.sync. In the browser test page,
   it's localStorage
 */

const isSettingAction = action => Object.keys(types).includes(action.type);

const settingActionPayload = action => action[types[action.type]];

export default storage => store => next => action => {
  if (isSettingAction(action)) {
    storage.set(action.type, settingActionPayload(action));
  }
  next(action);
};
