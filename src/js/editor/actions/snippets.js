/* global crypto */

import GithubApi from 'github'

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
export const UPLOADED_SNIPPETS = 'UPLOADED_SNIPPETS'

export const createSnippet = () => ({
  type: CREATE_SNIPPET
})

export const renameSnippet = (oldName, newName) => ({
  type: RENAME_SNIPPET,
  oldName,
  newName
})

export const updateSnippet = (name, newBody) => ({
  type: UPDATE_SNIPPET,
  name,
  newBody
})

export const deleteSnippet = name => ({
  type: DELETE_SNIPPET,
  name
})

export const loadSnippets = (token, gistId) => dispatch => {
  github.authenticate({
    type: 'token',
    token
  })
  github.gists.get({ id: gistId })
    .then(({ data: gist }) => {
      dispatch(loadedSnippets(
        Object.entries(gist.files)
          .reduce((snippets, [ fileName, { truncated, content } ]) => {
            snippets[fileName] = {
              name: fileName,
              body: truncated ? '(Truncated)' : content
            }
            return snippets
          }, {})
      ))
    })
    .catch(error => dispatch(loadedSnippets(error)))
}

export const loadedSnippets = (error, snippets = {}) => ({
  type: LOADED_SNIPPETS,
  snippets,
  error
})
