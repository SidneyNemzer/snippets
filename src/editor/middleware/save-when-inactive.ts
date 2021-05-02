import { Middleware } from "redux";

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

let timer: number | undefined;

const restartSaveTimer = (delay: number, save: () => void) => {
  window.clearTimeout(timer);
  if (delay > 0) {
    timer = window.setTimeout(save, delay);
  }
};

const stopSaveTimer = () => {
  clearTimeout(timer);
  timer = undefined;
};

const saveWhenInactive: Middleware = (store) => (next) => (action) => {
  if (modifyActions.includes(action.type)) {
    restartSaveTimer(store.getState().settings.autosaveTimer * 1000, () =>
      store.dispatch(saveSnippets())
    );
  } else if (action.type === SAVING_SNIPPETS) {
    stopSaveTimer();
  }
  next(action);
};

export default saveWhenInactive;
