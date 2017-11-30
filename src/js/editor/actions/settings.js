import { generateTypes, generateActions } from '../generate-redux'

const typeNames = {
  tabSize: true,
  autoComplete: true,
  softTabs: true,
  theme: true,
  lineWrap: true,
  linter: true,
  accessToken: true,
  gistId: true
}

export const types = generateTypes(typeNames)
export const actions = generateActions(typeNames)
