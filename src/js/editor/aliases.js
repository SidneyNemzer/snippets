/* global chrome */

/**
 * Redux actions that are usually thunks must be implemented with aliases
 * https://github.com/tshaddix/react-chrome-redux/wiki/Advanced-Usage
 */

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

const loadSnippets = octokit => () => (dispatch, getState) => {
  dispatch({ type: LOADING_SNIPPETS })

  octokit.gists.get({ gist_id: getState().settings.gistId })
    .then(({ data: gist }) => {
      dispatch(loadedSnippets(
        null,
        Object.entries(gist.files)
          .reduce((snippets, [ fileName, { truncated, content } ]) => {
            snippets[fileName] = {
              name: fileName,
              body: truncated ? '(Truncated)' : content // TODO handle truncated files
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

const saveSnippets = octokit => () => (dispatch, getState) => {
  const {
    snippets: { data },
    settings: { gistId }
  } = getState()

  if (!data) return

  dispatch({ type: SAVING_SNIPPETS })

  const files = Object.entries(data)
    .reduce((files, [name, snippet]) => {
      const content = snippet.content.local.trim()
        ? snippet.content.local
        : "(Github Gists can't be empty so Snippets saved this content)"

      files[name] =
        snippet.deleted
          ? null
          : { content, filename: snippet.renamed || undefined }
      return files
    }, {})
  octokit.gists.update({ gist_id: gistId, files })
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

export default octokit => ({
  [LOAD_SNIPPETS]: loadSnippets(octokit),
  [SAVE_SNIPPETS]: saveSnippets(octokit),
  [LOAD_LEGACY_SNIPPETS]: loadLegacySnippets
})
