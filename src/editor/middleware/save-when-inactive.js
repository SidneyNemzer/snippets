import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  SAVING_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
  saveSnippets
} from "../actions/snippets";

const modifyActions = [
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  LOADED_LEGACY_SNIPPETS
];

let timer = null;

const restartSaveTimer = (delay, save) => {
  clearTimeout(timer);
  if (delay > 0) {
    timer = setTimeout(save, delay);
  }
};

const stopSaveTimer = () => {
  clearTimeout(timer);
  timer = null;
};

export default store => next => action => {
  if (modifyActions.includes(action.type)) {
    restartSaveTimer(store.getState().settings.autosaveTimer * 1000, () =>
      store.dispatch(saveSnippets())
    );
  } else if (action.type === SAVING_SNIPPETS) {
    stopSaveTimer();
  }
  next(action);
};
