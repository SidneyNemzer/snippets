import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet
} from '../actions/snippets.js'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'

import '../../../style/main.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet: Object.keys(props.snippets)[0] || null,
      confirmingDelete: false
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.checkSelectedSnippet = this.checkSelectedSnippet.bind(this)
    this.deleteSnippet = this.deleteSnippet.bind(this)
    this.handleDeleteSnippet = this.handleDeleteSnippet.bind(this)
  }

  checkSelectedSnippet() {
    const { selectedSnippet } = this.state
    const { snippets } = this.props

    if (selectedSnippet === null || !snippets[selectedSnippet]) {
      this.setState({
        selectedSnippet: Object.keys(snippets)[0]
      }, () => console.log('checked selected'))
    }
  }

  selectSnippet(snippetID) {
    this.setState({
      selectedSnippet: snippetID,
      confirmingDelete: false
    })
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      const { selectedSnippet } = this.state
      const { snippets } = this.props
      // TODO Better error handling
      chrome.devtools.inspectedWindow.eval(snippets[selectedSnippet].body)
    }
  }

  handleEditorChange(newValue) {
    this.props.updateSnippet(
      this.state.selectedSnippet,
      newValue
    )
  }

  deleteSnippet(snippetID) {
    this.props.deleteSnippet(snippetID)
    console.log('deleted')
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
    const { selectedSnippet } = this.state
    const { snippets } = this.props

    if (selectedSnippet !== null) {
      return (
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="90%"
          theme="github"
          value={snippets[selectedSnippet].body}
          onChange={this.handleEditorChange}
          highlightActiveLine={false}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          editorProps={{$blockScrolling: Infinity}}
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
          snippets={this.props.snippets}
          selectedSnippet={this.state.selectedSnippet}
          selectSnippet={this.selectSnippet}
          renameSnippet={this.props.renameSnippet}
          createSnippet={this.props.createSnippet}
          handleDeleteSnippet={this.handleDeleteSnippet}
          confirmingDelete={this.state.confirmingDelete}
        />
        {this.renderEditor()}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  snippets: state.snippets
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    createSnippet,
    renameSnippet,
    updateSnippet,
    deleteSnippet
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
