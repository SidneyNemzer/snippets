import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET
} from '../actions/snippets.js'

const snippets = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SNIPPET:
      const toReturn = Object.assign({},
        state,
        {
          [action.id]: {
            name: action.name,
            body: ''
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
            body: state[action.id].body
          }
        }
      )
    case UPDATE_SNIPPET:
      return Object.assign({},
        state,
        {
          [action.id]: {
            name: state[action.id].name,
            body: action.newBody
          }
        }
      )
    case DELETE_SNIPPET:
      const newState = Object.assign({}, state)
      delete newState[action.id]
      return newState
    default:
      if (!action.type.includes('@@redux'))
        console.warn('Unknown action type:', action.type)
      return state
  }
}

export default snippets
