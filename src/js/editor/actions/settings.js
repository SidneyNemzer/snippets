import { generateTypes, generateActions } from '../generate-redux'

const types = {
  tabSize: true,
  autoComplete: true,
  softTabs: true,
  theme: true,
  lineWrap: true,
  linter: true,
  accessToken: true,
  gistId: true
}

export default {
  types: generateTypes(types),
  actions: generateActions(types)
}
