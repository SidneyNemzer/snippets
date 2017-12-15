import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet
} from '../actions/snippets.js'
import { actions as settingsActions } from '../actions/settings'

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
      selectedSnippet: null
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
    const { snippets: snippetsState } = this.props

    if (snippetsState.loaded && snippetsState.data) {
      const { data: snippets } = snippetsState
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.snippets.state !== nextProps.snippets) {
      this.selectPreviousSnippet()
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

  renderEditor(snippets) {
    const { selectedSnippet } = this.state

    if (selectedSnippet !== null) {
      return (
        <Editor
          value={snippets[selectedSnippet].content.local}
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

  isSaved(snippets) {
    return !Object.values(snippets)
      .find(({ content: { local, remote }, deleted, renamed }) =>
        local !== remote || deleted || renamed
      )
  }

  renderSaveMessage(snippets) {
    return (
      <span>
        {this.isSaved(snippets)
          ? 'Saved'
          : 'You have unsaved changes'
        }
      </span>
    )
  }

  renderMain(snippets) {
    return (
      <div
        className="home"
        onKeyDown={this.handleKeyPress}
      >
        <Sidepane
          snippets={snippets}
          selectedSnippet={this.state.selectedSnippet}
          selectSnippet={this.selectSnippet}
          renameSnippet={this.props.renameSnippet}
          createSnippet={this.props.createSnippet}
          deleteSnippet={this.deleteSnippet}
          runSnippet={this.runSnippet}
          handleOpenSettings={this.props.handleOpenSettings}
        />
        <div className="editor-container">
          <Header>
            {this.renderSaveMessage(snippets)}
          </Header>
          {this.renderEditor(snippets)}
        </div>
      </div>
    )
  }

  handleError(error) {
    return error.status === 'Unauthorized'
      ? <ErrorPage
        title="Failed to load snippets"
        message="Github didn't accept the access token"
        actionButton="Reset access token"
        onActionButtonClick={() => this.props.accessToken(false)}
      />
      : error.status === 'Not Found'
        ? <ErrorPage
          title="Failed to load snippets"
          message="The gist ID '' doesn't seem to exist"
          actionButton="Reset Gist ID"
          onActionButtonClick={() => this.props.gistId(false)}
        />
        : <ErrorPage
          title="Failed to load snippets"
          message={error}
        />
  }

  render() {
    const { snippets: snippetsState } = this.props
    if (snippetsState.loading || !snippetsState.data) {
      return <Loading />
    } else if (snippetsState.error) {
      return this.handleError(snippetsState.error)
    } else {
      return this.renderMain(snippetsState.data)
    }
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
    deleteSnippet,
    accessToken: settingsActions.accessToken,
    gistId: settingsActions.gistId
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
