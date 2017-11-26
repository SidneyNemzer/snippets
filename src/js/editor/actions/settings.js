export const TAB_SIZE = 'TAB_SIZE'
export const AUTO_COMPLETE = 'AUTO_COMPLETE'
export const SOFT_TABS = 'SOFT_TABS'
export const THEME = 'THEME'
export const LINE_WRAP = 'LINE_WRAP'
export const LINTER = 'LINTER'
export const ACCESS_TOKEN = 'ACCESS_TOKEN'
export const GIST_ID = 'GIST_ID'

export const tabSize = size => ({
  type: TAB_SIZE,
  size
})

export const autoComplete = shouldAutoComplete => ({
  type: AUTO_COMPLETE,
  shouldAutoComplete
})

export const softTabs = useSoftTabs => ({
  type: SOFT_TABS,
  useSoftTabs
})

export const theme = theme => ({
  type: THEME,
  theme
})

export const lineWrap = lineWrap => ({
  type: LINE_WRAP,
  lineWrap
})

export const linter = linter => ({
  type: LINTER,
  linter
})

export const accessToken = accessToken => ({
  type: ACCESS_TOKEN,
  accessToken
})

export const gistId = gistId => ({
  type: GIST_ID,
  gistId
})
