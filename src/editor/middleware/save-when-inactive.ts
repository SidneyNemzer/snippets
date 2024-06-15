import { Middleware } from "redux";

import { createTimer } from "../../lib/timer";
import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  SAVING_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
  saveSnippets,
} from "../actions/snippets";

const modifyActions = [
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  LOADED_LEGACY_SNIPPETS,
];

const timer = createTimer("save");

const saveWhenInactive: Middleware = (store) => {
  timer.setCallback(() => store.dispatch(saveSnippets()));

  return (next) => (action) => {
    const enabled = store.getState().settings.autosaveTimer > 0;

    if (modifyActions.includes(action.type) && enabled) {
      const delayMs = store.getState().settings.autosaveTimer * 1000;
      timer.set(delayMs);
    } else if (action.type === SAVING_SNIPPETS) {
      timer.cancel();
    }
    next(action);
  };
};

export default saveWhenInactive;
