/* global localStorage */

/* This file starts the editor to allow for interface development in a
   regular webpage. It simulates panel.js (start editor) and background.js
   (redux store)
*/

import { createCallbackAuth } from "@octokit/auth-callback";
import { Octokit } from "@octokit/rest";
import { createStore, applyMiddleware, AnyAction } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { alias, Store } from "webext-redux";

import createEditor from "./editor";
import { types, Types as SettingsTypes } from "./editor/actions/settings";
import createAliases from "./editor/aliases";
import { OCTOKIT_USER_AGENT } from "./editor/constants";
import errorMiddleware from "./editor/middleware/log-error";
import saveMiddleware from "./editor/middleware/save-when-inactive";
import settingsMiddleware from "./editor/middleware/settings";
import rootReducer from "./editor/reducers";
import {
  defaultState as defaultSettings,
  SettingsState,
} from "./editor/reducers/settings";

const LOCAL_STORAGE_PREFIX = "snippets-settings:";

const storage = {
  set: (path: string, data: unknown) => {
    localStorage[LOCAL_STORAGE_PREFIX + path] = JSON.stringify(data);
  },
};

// TODO the interaction between octokit and the store is weird, can we untangle
// this somehow?
const store = (() => {
  const octokit = new Octokit({
    userAgent: OCTOKIT_USER_AGENT,
    authStrategy: createCallbackAuth,
    auth: {
      callback: () => store.getState().settings.accessToken,
    },
  });

  const store = createStore(
    rootReducer,
    {
      settings: Object.assign(
        defaultSettings,
        Object.keys(types).reduce((accum, key) => {
          const storedValue = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
          (accum as any)[key] =
            storedValue === null
              ? defaultSettings[key as SettingsTypes]
              : JSON.parse(storedValue);
          return accum;
        }, {} as SettingsState)
      ),
    },
    applyMiddleware(
      alias(createAliases(octokit)),
      thunk,
      errorMiddleware,
      settingsMiddleware(storage),
      saveMiddleware,
      createLogger({ collapsed: true })
    )
  );

  return store;
})();

const delayedDispatch = (action: AnyAction) => {
  // Delay dispatches to the next tick simulate the asynchronous updates in
  // webext-redux
  setTimeout(() => {
    store.dispatch(action);
  }, 0);
};

createEditor(
  // eslint-disable-next-line no-eval
  eval,
  "test-tab",
  new Proxy(store, {
    get: (target, key) => {
      if (key === "dispatch") {
        return delayedDispatch;
      } else {
        return (target as any)[key];
      }
    },
  }) as Store
);
// Simulate webext-redux store load event
store.dispatch({ type: "LOADED" });
