/* global crypto */

import GithubApi from 'github'
import * as RemoteData from '../RemoteData'

const github = new GithubApi({
  headers: {
    'user-agent': 'snippets'
  }
})

export const CREATE_SNIPPET = 'CREATE_SNIPPET'
export const RENAME_SNIPPET = 'RENAME_SNIPPET'
export const UPDATE_SNIPPET = 'UPDATE_SNIPPET'
export const DELETE_SNIPPET = 'DELETE_SNIPPET'
export const LOADED_SNIPPETS = 'LOADED_SNIPPETS'

// Generate a unique ID using the crypto API
// Source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export const createSnippet = name => ({
  type: CREATE_SNIPPET,
  id: uuidv4(),
  name
})

export const renameSnippet = (id, newName) => ({
  type: RENAME_SNIPPET,
  id,
  newName
})

export const updateSnippet = (id, newBody) => ({
  type: UPDATE_SNIPPET,
  id,
  newBody
})

export const deleteSnippet = id => ({
  type: DELETE_SNIPPET,
  id
})

export const loadSnippets = (token, gistId) => dispatch => {
  github.authenticate({
    type: 'token',
    token
  })
  github.gists.get({id: gistId})
    .then(({data: gist}) => {
      dispatch(loadedSnippets(RemoteData.success(
        Object.entries(gist.files)
          .reduce((snippets, [ fileName, { truncated, content } ]) => {
            snippets[fileName] = {
              name: fileName,
              body: truncated ? '(Truncated)' : content
            }
            return snippets
          }, {})
      )))
    })
    .catch(error => dispatch(loadedSnippets(RemoteData.failure(error))))
}

export const loadedSnippets = snippets => ({
  type: LOADED_SNIPPETS,
  snippets
})
