import GithubApi from 'github'

const github = new GithubApi({
  headers: {
    'user-agent': 'snippets'
  }
})

const processGithubError = error => {
  console.log('process error', error)
  if (error.message) {
    if (error.message === 'Bad credentials') {
      return 'Invalid access token'
    } else if (error.message === 'Failed to fetch') {
      return 'Are you connected to the internet?'
    } else {
      try {
        const parsed = JSON.parse(error.message)
        if (parsed.message) {
          return parsed.message
        }
        return parsed
      } catch (e) {
        return error.message
      }
    }
  }
  return error
}

export const CREATE_SNIPPET = 'CREATE_SNIPPET'
export const RENAME_SNIPPET = 'RENAME_SNIPPET'
export const UPDATE_SNIPPET = 'UPDATE_SNIPPET'
export const DELETE_SNIPPET = 'DELETE_SNIPPET'
export const LOADED_SNIPPETS = 'LOADED_SNIPPETS'
export const SAVING_SNIPPETS = 'SAVING_SNIPPETS'
export const SAVED_SNIPPETS = 'SAVED_SNIPPETS'

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

export const loadSnippets = () => (dispatch, getState) => {
  const { settings: { accessToken, gistId } } = getState()
  github.authenticate({
    type: 'token',
    token: accessToken
  })
  github.gists.get({ id: gistId })
    .then(({ data: gist }) => {
      dispatch(loadedSnippets(
        null,
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

export const saveSnippets = (token, gistId) => (dispatch, getState) => {
  const { snippets: { data } } = getState()
  if (!data) return

  dispatch({ type: SAVING_SNIPPETS })

  const files = Object.entries(data)
    .reduce((files, [name, snippet]) => {
      files[name] =
        snippet.deleted
          ? null
          : {
            content: snippet.content.local,
            filename: snippet.renamed || undefined
          }
      return files
    }, {})
  github.authenticate({ type: 'token', token })
  github.gists.edit({
    id: gistId,
    files
  })
    .then(() => dispatch(savedSnippets(null)))
    .catch(error => dispatch(savedSnippets(processGithubError(error))))
}

export const savedSnippets = error => ({
  type: SAVED_SNIPPETS,
  error
})
