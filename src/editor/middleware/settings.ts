import { AnyAction, Middleware } from "redux";

import { types } from "../actions/settings";

// This middleware handles saving settings to the current environment's
// storage. In Chrome, this is chrome.storage.sync. In the browser test page,
// it's localStorage

type Storage = {
  set: (key: string, value: any) => void;
};

const isSettingAction = (action: AnyAction) =>
  Object.keys(types).includes(action.type);

const settingActionPayload = (action: AnyAction) =>
  action[types[action.type as keyof typeof types]];

const settingsMiddleware = (storage: Storage): Middleware => (store) => (
  next
) => (action) => {
  if (isSettingAction(action)) {
    storage.set(action.type, settingActionPayload(action));
  }
  next(action);
};

export default settingsMiddleware;
