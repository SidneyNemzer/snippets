import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  SAVED_SNIPPET
} from '../actions/snippets.js'

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

  * Save the selected snippet
    CTRL+S
    (Mac also uses CTRL+S)


SYNC

  Your snippets will be synced to any Chrome that you're logged into


BUGS / ISSUES / SUGGESTIONS

  Open an issue on this project's Github
  https://github.com/SidneyNemzer/snippets/issues

HAPPY CODING!
*/
`

const defaultState = {
  a: {
    name: 'Welcome!',
    body: welcomeSnippet,
    saved: true
  }
}

const snippets = (state = defaultState, action) => {
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