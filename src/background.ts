import { createCallbackAuth } from "@octokit/auth-callback";
import { Octokit } from "@octokit/rest";
import * as R from "ramda";
import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { wrapStore, alias } from "webext-redux";

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

chrome.storage.sync.get().then((storage) => {
  store = createStore(
    rootReducer,
    {
      settings: Object.assign(defaultSettings, storage.settings),
    },
    applyMiddleware(
      alias(createAliases(octokit)),
      thunk,
      errorMiddleware,
      settingsMiddleware(settingsStorage),
      saveMiddleware
    )
  );
  wrapStore(store, { portName: "SNIPPETS" });
});
