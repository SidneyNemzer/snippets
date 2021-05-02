import { generateTypes, generateActions } from "../util/generate-redux";

const typeNames = {
  tabSize: true,
  autoComplete: true,
  softTabs: true,
  theme: true,
  lineWrap: true,
  linter: true,
  accessToken: true,
  gistId: true,
  autosaveTimer: true,
  fontSize: true,
} as const;

export type Types = keyof typeof typeNames;

export const types = generateTypes(typeNames);
export const actions = generateActions(typeNames);
