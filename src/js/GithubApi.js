/* global fetch */

const apiBase = (token, endpoint) =>
  fetch(`https://api.github.com/${endpoint}?access_token=${token}`)
    .then(res => {
      if (res.status !== 200) {
        return res.json().then(data => {
          return Promise.reject({
            code: data.message === 'Bad credentials'
              ? 'auth/bad-credentials'
              : 'unknown',
            message: data.message
          })
        })
      }
      return res.json()
    })
    .then(result => {
      console.log(result)
      return result
    })

export default {
  gists: {
    list: token => apiBase(token, 'gists'),
    get: (token, id) => apiBase(token, `gists/${id}`)
  }
}
