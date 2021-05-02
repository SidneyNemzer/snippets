import { combineReducers } from "redux";

import { reducer as settings, SettingsState } from "./settings";
import snippets, { SnippetsState } from "./snippets";

export type RootState = {
  snippets: SnippetsState;
  settings: SettingsState;
};

export default combineReducers({
  settings,
  snippets,
});
