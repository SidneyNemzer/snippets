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

let timer: ReturnType<typeof setTimeout> | undefined;

const restartSaveTimer = (delay: number, save: () => void) => {
  if (timer) {
    clearTimeout(timer);
  }

  if (delay > 0) {
    timer = setTimeout(save, delay);
  } else {
    save();
  }
};

const stopSaveTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
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
