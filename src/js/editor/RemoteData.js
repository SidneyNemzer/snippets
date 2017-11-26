export const LOADING = 'LOADING'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export const loading = () => ({
  state: LOADING
})

export const success = data => ({
  state: SUCCESS,
  data
})

export const failure = data => ({
  state: FAILURE,
  data
})

export const split = (actions, remoteData) => {
  switch (remoteData.state) {
    case LOADING:
      return actions.loading
    case SUCCESS:
      return actions.success(remoteData.data)
    case FAILURE:
      return actions.failure(remoteData.data)
    default:
      throw new Error('Unexpected remote data state')
  }
}

export const ifSuccess = (actions, remoteData) => {
  split({
    loading: actions.else,
    success: actions.then,
    failure: actions.else
  }, remoteData)
}
