/* global chrome */

/**
 * Redux actions that are usually thunks must be implemented with aliases
 * https://github.com/tshaddix/react-chrome-redux/wiki/Advanced-Usage
 */

import GithubApi from 'github'
import {
  LOAD_SNIPPETS,
  LOADING_SNIPPETS,
  LOAD_LEGACY_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
  SAVE_SNIPPETS,
  SAVING_SNIPPETS,
  loadedSnippets,
  savedSnippets
} from './actions/snippets'

const github = new GithubApi({ headers: { 'user-agent': 'snippets' } })

const loadSnippets = () => (dispatch, getState) => {
  const { settings: { accessToken, gistId } } = getState()

  dispatch({ type: LOADING_SNIPPETS })

  github.authenticate({ type: 'token', token: accessToken })
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
    .catch(error => {
      error.context = 'load snippets'
      dispatch(loadedSnippets(error))
    })
}

const saveSnippets = () => (dispatch, getState) => {
  const {
    snippets: { data },
    settings: { accessToken, gistId }
  } = getState()

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
  github.authenticate({ type: 'token', token: accessToken })
  github.gists.edit({ id: gistId, files })
    .then(() => dispatch(savedSnippets(null)))
    .catch(error => {
      error.context = 'save snippets'
      dispatch(savedSnippets(error))
    })
}

const loadLegacySnippets = () => (dispatch, getState) => {
  chrome.storage.sync.get(storage => {
    const snippets =
      Object
        .entries(storage.snippets)
        .reduce(
          (snippets, [ id, value ]) => {
            const { content, body, name } = value
            if (body || content) {
              snippets[name] = body || content
            }
            return snippets
          },
          {}
        )

    dispatch({
      type: LOADED_LEGACY_SNIPPETS,
      error: null,
      snippets
    })
  })
}

export default {
  [LOAD_SNIPPETS]: loadSnippets,
  [SAVE_SNIPPETS]: saveSnippets,
  [LOAD_LEGACY_SNIPPETS]: loadLegacySnippets
}
