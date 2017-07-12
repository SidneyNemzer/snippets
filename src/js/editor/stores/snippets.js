import createEmitter from '../util/emitter'

const emitter = createEmitter()
let snippets = {}

export default (initalState = {}) => {
  snippets = Object.keys(initalState).reduce(
    (updatedState, snippetId) => (
      updatedState[snippetId] = Object.assign({
        saved: true
      }, updatedState[snippetId])
    ),
    initalState
  )

  return {
    getSnippets: () => {
      return snippets
    },

    getSnippet: (id) => (
      snippets[id]
    ),

    newSnippet: (id, name = '', content = '') => {
      snippets[id] = {
        name,
        content,
        saved: false
      }

      emitter.emit(id)
    },

    updateSnippet: (id, newName, newContent) => {
      const { name, content } = snippets[id]

      snippets[id] = {
        name: newName || name,
        content: newContent || content,
        saved: false
      }

      emitter.emit(id)
    },

    deleteSnippet: (id) => {
      delete snippets[id]

      emitter.emit(id)
    },

    subscribe: emitter.subscribe,

    unsubscribe: emitter.unsubscribe
  }
}
