import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet
} from '../actions/snippets.js'
import { accessToken } from '../actions/settings'
import * as RemoteData from '../RemoteData'

import Sidepane from './Sidepane'
import Header from './Header'
import Editor from './Editor'
import Loading from './Loading'
import ErrorPage from './ErrorPage'

import logo from '../../../../images/logo-transparent.png'

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
}`

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
    if (snippetID === this.state.selectedSnippet) {
      this.selectPreviousSnippet()
        .then(() => this.props.deleteSnippet(snippetID))
    } else {
      this.props.deleteSnippet(snippetID)
    }
  }

  renderEditor() {
    const { selectedSnippet } = this.state
    const { snippets } = this.props

    if (selectedSnippet !== null) {
      return (
        <Editor
          value={snippets[selectedSnippet].body}
          onChange={this.handleEditorChange}
        />
      )
    } else {
      return (
        <div className="none-selected">
          <img src={logo} />
          <p>Nothing Selected</p>
        </div>
      )
    }
  }

  renderSaveMessage() {
    const { saved } = this.props
    if (saved === true) {
      return <span>Saved</span>
    } else if (saved === false) {
      return <span>Saving...</span>
    } else if (typeof saved === 'object') {
      if (saved.moreInfo) {
        return <a className="save-error" target="_blank" href={saved.moreInfo}>{saved.reason}</a>
      } else {
        return <span className="save-error">{saved.reason}</span>
      }
    }
  }

  renderMain(snippets) {
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
          deleteSnippet={this.deleteSnippet}
          confirmingDelete={this.state.confirmingDelete}
          runSnippet={this.runSnippet}
          handleOpenSettings={this.props.handleOpenSettings}
        />
        <div className="editor-container">
          <Header>
            {this.renderSaveMessage()}
          </Header>
          {this.renderEditor()}
        </div>
      </div>
    )
  }

  render() {
    return RemoteData.split({
      loading: <Loading />,
      success: this.renderMain.bind(this),
      failure: error => (
        error.code === 'auth/bad-credentials'
          ? <ErrorPage
            title="Failed to load snippets"
            message="Github didn't accept the access token"
            actionButton="Reset access token"
            onActionButtonClick={() => this.props.accessToken(false)}
          />
          : <ErrorPage
            title="Failed to load snippets"
            message={error}
          />
      )
    }, this.props.snippets)
  }
}

const mapStateToProps = (state, props) => ({
  snippets: state.snippets,
  saved: state.saved
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    createSnippet,
    renameSnippet,
    updateSnippet,
    deleteSnippet,
    accessToken
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
