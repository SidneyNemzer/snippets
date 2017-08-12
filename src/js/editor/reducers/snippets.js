import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  SAVED_SNIPPET
} from '../actions/snippets.js'

const snippets = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SNIPPET:
      const toReturn = Object.assign({},
        state,
        {
          [action.id]: {
            name: action.name,
            body: '',
            saved: false
          }
        }
      )
      return toReturn
    case RENAME_SNIPPET:
      return Object.assign({},
        state,
        {
          [action.id]: {
            name: action.newName,
            body: state[action.id].body,
            saved: false
          }
        }
      )
    case UPDATE_SNIPPET:
      return Object.assign({},
        state,
        {
          [action.id]: {
            name: state[action.id].name,
            body: action.newBody,
            saved: false
          }
        }
      )
    case DELETE_SNIPPET:
      const newState = Object.assign({}, state)
      delete newState[action.id]
      return newState
    case SAVED_SNIPPET:
      return Object.assign({},
        state,
        {
          [action.id]: {
            name: state[action.id].name,
            body: state[action.id].body,
            saved: true
          }
        }
      )
    default:
      if (!action.type.includes('@@redux'))
        console.warn('Unknown action type:', action.type)
      return state
  }
}

export default snippets
