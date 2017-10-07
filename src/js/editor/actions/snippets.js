/* global crypto */
export const CREATE_SNIPPET = 'CREATE_SNIPPET'
export const RENAME_SNIPPET = 'RENAME_SNIPPET'
export const UPDATE_SNIPPET = 'UPDATE_SNIPPET'
export const DELETE_SNIPPET = 'DELETE_SNIPPET'

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
