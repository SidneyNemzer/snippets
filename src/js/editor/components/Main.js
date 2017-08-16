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
import Header from './Header'
import Editor from './Editor'

//import '../../../style/main.css'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet: Object.keys(props.snippets)[0] || null,
      confirmingDelete: false
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.selectPreviousSnippet = this.selectPreviousSnippet.bind(this)
    this.deleteSnippet = this.deleteSnippet.bind(this)
    this.handleDeleteSnippet = this.handleDeleteSnippet.bind(this)
    this.runSnippet = this.runSnippet.bind(this)
  }

  selectPreviousSnippet() {
    const { selectedSnippet } = this.state
    const { snippets } = this.props

    if (Object.keys(snippets).length < 2) {
      return this.selectSnippet(null)
    }

    if (selectedSnippet === null) {
      return this.selectSnippet(Object.keys(snippets)[0])
    }

    const selectedIndex = Object.keys(snippets).findIndex(snippetId => {
      return snippetId === selectedSnippet
    })

    if (selectedIndex > 0) {
      return this.selectSnippet(Object.keys(snippets)[selectedIndex - 1])
    } else {
      return this.selectSnippet(Object.keys(snippets)[1])
    }
  }

  selectSnippet(snippetID) {
    return new Promise(resolve => {
      this.setState({
        selectedSnippet: snippetID
      }, resolve)
    })
  }

  runSnippet(snippetBody) {
    const code = `
      try {
        ${snippetBody}
      } catch (e) {
        console.error(e)
      }
    `

    this.props.runInInspectedWindow(code)
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      const { selectedSnippet } = this.state
      const { snippets } = this.props
      this.runSnippet(snippets[selectedSnippet].body)
    }
  }

  handleEditorChange(newValue) {
    this.props.updateSnippet(
      this.state.selectedSnippet,
      newValue
    )
  }

  deleteSnippet(snippetID) {
    this.selectPreviousSnippet()
      .then(() => this.props.deleteSnippet(snippetID))
  }

  handleDeleteSnippet() {
    // TODO redundant
    this.deleteSnippet(this.state.selectedSnippet)
  }

  renderEditor() {
    const { selectedSnippet } = this.state
    const { snippets } = this.props

    if (selectedSnippet !== null) {
      return (
        <Editor
          theme="github"
          value={snippets[selectedSnippet].body}
          onChange={this.handleEditorChange}
          autoCompletion={true}
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
    const saveMessage =
      !!Object.values(this.props.snippets)
        .find(snippet => !snippet.saved)
        ? 'Saving...'
        : 'Saved'

    return (
      <div
        className="home"
        onKeyDown={this.handleKeyPress}
      >
        <Sidepane
          snippets={this.props.snippets}
          selectedSnippet={this.state.selectedSnippet}
          selectSnippet={this.selectSnippet}
          renameSnippet={this.props.renameSnippet}
          createSnippet={this.props.createSnippet}
          deleteSnippet={this.handleDeleteSnippet}
          confirmingDelete={this.state.confirmingDelete}
          runSnippet={this.runSnippet}
        />
        <div className="editor-container">
          <Header
            message={saveMessage}
          />
          {this.renderEditor()}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Main)
