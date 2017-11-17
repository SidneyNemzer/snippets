/* global fetch */

const apiBase = (token, endpoint) =>
  fetch(`https://api.github.com/${endpoint}?access_token=${token}`)
    .then(res => {
      if (res.status !== 200) {
        return res.json().then(data => {
          const error = new Error()
          error.message = data.message
          throw error
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
