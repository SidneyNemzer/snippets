import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'

import '../../../style/main.css'

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

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet: 0,
      snippets: props.snippetStore.getSnippets(),
      nextId: 0,
      confirmingDelete: false
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateSnippetName = this.updateSnippetName.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.checkSelectedSnippet = this.checkSelectedSnippet.bind(this)
    this.createSnippet = this.createSnippet.bind(this)
    this.getNextId = this.getNextId.bind(this)
    this.deleteSnippet = this.deleteSnippet.bind(this)
    this.handleDeleteSnippet = this.handleDeleteSnippet.bind(this)

    props.snippetStore.subscribe(() => {
      this.setState({
        snippets: props.snippetStore.getSnippets()
      })
    })
  }

  getNextId() {
    return this.props.getNextId()
  }

  checkSelectedSnippet() {
    const { snippets, selectedSnippet } = this.state

    if (selectedSnippet === 0 || !snippets[selectedSnippet]) {
      this.setState({
        selectedSnippet: Object.keys(snippets)[0]
      })
    }
  }

  selectSnippet(snippetID) {
    this.setState({
      selectedSnippet: snippetID,
      confirmingDelete: false
    })
  }

  createSnippet() {
    const id = this.getNextId()
    this.props.snippetStore.newSnippet(id)
  }

  updateSnippetName(snippetID, newName) {
    this.props.snippetStore.updateSnippet(snippetID, newName)
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      // TODO Better error handling
      chrome.devtools.inspectedWindow.eval(this.state.snippets[this.state.selectedSnippet].content)
    }
  }

  handleEditorChange(newValue) {
    this.props.snippetStore.updateSnippet(this.state.selectedSnippet, null, newValue)
  }

  deleteSnippet(snippetID) {
    this.props.snippetStore.deleteSnippet(snippetID)
    this.checkSelectedSnippet()
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

  renderEditor() {
    const { selectedSnippet, snippets } = this.state

    if (selectedSnippet !== 0) {
      return (
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="90%"
          theme="github"
          value={snippets[selectedSnippet].content}
          onChange={this.handleEditorChange}
          highlightActiveLine={false}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          editorProps={{$blockScrolling: true}}
        />
      )
    } else {
      return (
        <div className="none-selected">
          Nothing is selected
        </div>
      )
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
        />
        {this.renderEditor()}
      </div>
    )
  }
}

export default App
