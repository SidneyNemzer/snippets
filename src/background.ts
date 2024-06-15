import { createCallbackAuth } from "@octokit/auth-callback";
import { Octokit } from "@octokit/rest";
import * as R from "ramda";
import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { createWrapStore, alias } from "webext-redux";

import createAliases from "./editor/aliases";
import { OCTOKIT_USER_AGENT } from "./editor/constants";
import errorMiddleware from "./editor/middleware/log-error";
import saveMiddleware from "./editor/middleware/save-when-inactive";
import settingsMiddleware from "./editor/middleware/settings";
import rootReducer, { RootState } from "./editor/reducers";
import { defaultState as defaultSettings } from "./editor/reducers/settings";

const chromeSyncStorageSetMerge = async (newStorage: any) => {
  const storage = await chrome.storage.sync.get();
  const mergedValue = R.mergeDeepRight(storage, newStorage);
  await chrome.storage.sync.set(mergedValue);
};

const settingsStorage = {
  set: (key: string, data: any) =>
    chromeSyncStorageSetMerge({
      settings: {
        [key]: data,
      },
    }),
};

const wrapStore = createWrapStore();

// TODO the interaction between octokit and the store is weird, can we untangle
// this somehow?
let store: Store<RootState> | undefined;

const octokit = new Octokit({
  userAgent: OCTOKIT_USER_AGENT,
  authStrategy: createCallbackAuth,
  auth: {
    callback: () => store?.getState().settings.accessToken,
  },
});

Promise.all([
  chrome.storage.sync.get({ settings: {} }),
  chrome.storage.session.get({ state: {} }),
]).then(([{ settings }, { state }]) => {
  store = createStore(
    rootReducer,
    Object.assign(state, {
      settings: Object.assign({}, defaultSettings, settings),
    }),
    applyMiddleware(
      alias(createAliases(octokit)),
      thunk,
      errorMiddleware,
      settingsMiddleware(settingsStorage),
      saveMiddleware
    )
  );
  wrapStore(store, { portName: "SNIPPETS" });

  store.subscribe(() => {
    chrome.storage.session.set({ state: store!.getState() });
  });
});
