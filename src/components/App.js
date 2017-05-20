import Logger from 'logger'

import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'

import '../style.css'

const logger = new Logger('App')

const welcomeSnippet = `
/***********************
* Welcome to snippets! *
***********************/

console.log('Welcome to snippets!')

/*
CONTROLS

  * Run a snippet in the page that you opened the devtools on
    CTRL+ENTER / CMD+ENTER
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

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet: null,
      snippets: {},
      nextId: 0,
      confirmingDelete: false,
      unsavedSnippets: {}
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateSnippetName = this.updateSnippetName.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.saveSnippetToStorage = this.saveSnippetToStorage.bind(this)
    this.resetSnippets = this.resetSnippets.bind(this)
    this.createSnippet = this.createSnippet.bind(this)
    this.getNextId = this.getNextId.bind(this)
    this.deleteSnippet = this.deleteSnippet.bind(this)
    this.handleDeleteSnippet = this.handleDeleteSnippet.bind(this)

    this.props.loadFromStorage()
      .then(function (storage) {
        this.resetSnippets(storage.snippets ? storage.snippets : {})

        let nextId = storage.nextId
        if (typeof nextId != 'number' || Number.isNaN(nextId)) {
          nextId = 0
        }

        this.setState({nextId})
      }.bind(this))
  }

  getNextId() {
    const nextId = this.state.nextId

    this.props.saveToStorage('nextId', nextId + 1)
      .then(() => {
        this.setState({
          nextId: nextId + 1
        })
      })

    return nextId
  }

  resetSnippets(snippets) {
    const newState = {
      snippets: snippets
    }
    if (Object.keys(newState.snippets).length === 0) {
      newState.snippets = {
        '0': {
          name: 'Welcome',
          content: welcomeSnippet
        }
      }
    }
    if (!this.state.selectedSnippet || !newState.snippets[this.state.selectedSnippet]) {
      newState.selectedSnippet = Object.keys(newState.snippets)[0]
    }

    this.setState(newState)
  }

  selectSnippet(snippetID) {
    this.setState({
      selectedSnippet: snippetID,
      confirmingDelete: false
    })
  }

  createSnippet() {
    const id = this.getNextId()
    this.setState(function (previousState) {
      previousState.snippets[id] = {
        name: 'New Snippet #' + id,
        content: ''
      }

      previousState.unsavedSnippets[id] = true

      return previousState
    })
  }

  updateSnippetName(snippetID, newName) {
    this.setState(function (previousState) {
      previousState.snippets[snippetID].name = newName
      return previousState
    })
  }

  saveSnippetToStorage(snippetID) {
    this.props.saveToStorage('snippets', {
      [snippetID]: this.state.snippets[snippetID]
    }, true)

    this.setState(function (previousState) {
      delete previousState.unsavedSnippets[snippetID]

      return previousState
    })
  }

  handleKeyPress(event) {
    if (event.key === 's' && event.ctrlKey) {
      this.saveSnippetToStorage(this.state.selectedSnippet)
    // TODO Support Mac!
    } else if (event.key === 'Enter' && event.ctrlKey) {
      chrome.devtools.inspectedWindow.eval(this.state.snippets[this.state.selectedSnippet].content)
    }
  }

  handleEditorChange(newValue) {
    this.setState(function (previousState) {
      previousState.snippets[this.state.selectedSnippet].content = newValue
      previousState.unsavedSnippets[this.state.selectedSnippet] = true
      return previousState
    })
  }

  deleteSnippet(snippetID) {
    this.props.loadFromStorage('snippets')
      .then(storeSnippets => {
        delete storeSnippets[snippetID]

        const previousSnippets = this.state.snippets
        delete previousSnippets[snippetID]

        this.resetSnippets(previousSnippets)

        this.props.saveToStorage('snippets', storeSnippets)
      })
  }

  handleDeleteSnippet() {
    if (this.state.confirmingDelete) {
      this.deleteSnippet(this.state.selectedSnippet)
      this.setState({
        confirmingDelete: false
      })
    } else {
      this.setState({
        confirmingDelete: true
      })
    }
  }

  render() {
    return (
      <div
        className="app"
        onKeyDown={this.handleKeyPress}
      >
        <Sidepane
          snippets={this.state.snippets}
          selectedSnippet={this.state.selectedSnippet}
          selectSnippet={this.selectSnippet}
          updateSnippetName={this.updateSnippetName}
          createSnippet={this.createSnippet}
          handleDeleteSnippet={this.handleDeleteSnippet}
          confirmingDelete={this.state.confirmingDelete}
          unsavedSnippets={this.state.unsavedSnippets}
        />
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="90%"
          theme="github"
          value={
            this.state.selectedSnippet
              ? this.state.snippets[this.state.selectedSnippet].content
              : 'Please select or create a snippet!'
          }
          readOnly={typeof this.state.selectedSnippet != 'string'}
          onChange={this.handleEditorChange}
          highlightActiveLine={false}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
        />
      </div>
    )
  }
}

export default App
