export const SAVED = 'SAVED'
export const SAVE_FAILED = 'SAVE_FAILED'

export const saved = () => ({
  type: SAVED
})

export const saveFailed = (reason, moreInfo) => ({
  type: SAVE_FAILED,
  reason,
  moreInfo
})
