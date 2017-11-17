import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  LOADED_SNIPPETS
} from '../actions/snippets.js'

/* eslint-disable no-unused-vars */
const welcomeSnippet = `
/***********************
* Welcome to snippets! *
***********************/

console.log('Welcome to snippets!')

/*
CONTROLS

  * Run a snippet in the page that you opened the devtools on
    CTRL+ENTER
    (You must have the snippet focused)

  * Toggle the devtools console
    ESC


EVERYTHING IS AUTOSAVED

  Once you stop typing, your work will be automatically saved


SYNC

  Your snippets will be synced to any Chrome that you're logged into


BUGS / ISSUES / SUGGESTIONS

  Open an issue on this project's Github
  https://github.com/SidneyNemzer/snippets/issues


HAPPY CODING!
*/
`

const defaultState = false

const snippets = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_SNIPPET:
      return Object.assign({},
        state,
        {
          [action.id]: {
            name: action.name,
            body: ''
          }
        }
      )
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
    case LOADED_SNIPPETS:
      console.log('Loaded snippets dispatched')
      return action.snippets
    default:
      return state
  }
}

export default snippets
