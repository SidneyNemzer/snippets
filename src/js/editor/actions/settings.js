export const TAB_SIZE = 'TAB_SIZE'
export const AUTO_COMPLETE = 'AUTO_COMPLETE'
export const SOFT_TABS = 'SOFT_TABS'
export const THEME = 'THEME'

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
