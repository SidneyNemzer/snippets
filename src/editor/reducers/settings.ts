import { types } from "../actions/settings";
import { generateReducer } from "../util/generate-redux";

export type SettingsState = {
  tabSize: number;
  autoComplete: boolean;
  softTabs: boolean;
  theme: string;
  lineWrap: boolean;
  linter: boolean;
  accessToken: string | false;
  gistId: string | false;
  autosaveTimer: number;
  fontSize: number;
};

export const defaultState: SettingsState = {
  [types.tabSize]: 2,
  [types.autoComplete]: true,
  [types.softTabs]: true,
  [types.theme]: "github",
  [types.lineWrap]: false,
  [types.linter]: true,
  [types.accessToken]: false,
  [types.gistId]: false,
  [types.autosaveTimer]: 5,
  [types.fontSize]: 12,
};

export const reducer = generateReducer(defaultState);
