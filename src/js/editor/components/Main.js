import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { pages, SNIPPETS_ISSUES_URL } from '../constants'
import {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet,
  saveSnippets,
  loadSnippets
} from '../actions/snippets.js'
import { actions as settingsActions } from '../actions/settings'
import Sidepane from './Sidepane'
import Header from './Header'
import Editor from './Editor'
import Loading from './Loading'
import ErrorPage from './ErrorPage'

import logo from '../../../../images/logo-transparent.png'

const saveStatus = {
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  UNSAVED: 'UNSAVED'
}

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet:
        props.snippets.data
          ? Object.keys(props.snippets.data)[0]
          : null
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
    const { snippets: { loading, data } } = this.props

    if (!loading && data) {
      const snippetKeys = Object.keys(data)

      if (snippetKeys.length < 2) {
        return this.selectSnippet(null)
      }

      if (selectedSnippet === null) {
        return this.selectSnippet(snippetKeys[0])
      }

      const selectedIndex = snippetKeys
        .findIndex(snippetId => snippetId === selectedSnippet)

      if (selectedIndex > 0) {
        return this.selectSnippet(snippetKeys[selectedIndex - 1])
      } else {
        return this.selectSnippet(snippetKeys[1])
      }
    } else {
      return Promise.resolve()
    }
  }

  UNSAFE_componentWillReceiveProps({ snippets: { data: newData } }) {
    const { snippets: { data } } = this.props
    const { selectedSnippet } = this.state

    if (!selectedSnippet) {
      if (newData) {
        this.setState({
          selectedSnippet: Object.keys(newData)[0]
        })
      }
    } else {
      if (newData && !newData[selectedSnippet]) {
        if (
          data[selectedSnippet]
          && data[selectedSnippet].renamed
          && newData[data[selectedSnippet].renamed]
        ) {
          this.setState({
            selectedSnippet: data[selectedSnippet].renamed
          })
        } else {
          this.setState({
            selectedSnippet: Object.keys(newData)[0]
          })
        }
      } else if (!newData) {
        this.setState({ selectedSnippet: null })
      }
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
      const snippet = snippets.data[selectedSnippet]
      if (snippet) {
        this.runSnippet(snippet.content.local)
      }
    }
  }

  handleEditorChange(newValue) {
    this.props.updateSnippet(
      this.state.selectedSnippet,
      newValue,
      chrome.devtools.inspectedWindow.tabId
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
    const { selectedSnippet: snippetId } = this.state

    if (snippetId !== null) {
      const snippet = snippets[snippetId]
      return (
        <Editor
          key={snippetId}
          value={snippet.content.local}
          onChange={this.handleEditorChange}
          editorId={chrome.devtools.inspectedWindow.tabId}
          lastUpdatedBy={snippet.lastUpdatedBy}
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

  renderSaveMessage(snippets) {
    const { snippets: { error } } = this.props
    if (error) {
      return (
        <span
          style={{ cursor: 'pointer' }}
          onClick={this.props.saveSnippets}
        >
          {error.context ? 'Failed to ' + error.context : 'Error'}:{' '}
          {error.message}{' '}
          -- click to retry
        </span>
      )
    }
    switch (this.props.saveStatus) {
      case saveStatus.SAVED:
        return <span>Saved</span>
      case saveStatus.SAVING:
        return <span>Saving...</span>
      case saveStatus.UNSAVED:
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={this.props.saveSnippets}
          >
            You have unsaved changes
          </span>
        )
      default:
        throw new Error('Unexpected save status:' + this.props.saveStatus)
    }
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
          handleOpenSettings={() => this.props.history.push(pages.SETTINGS)}
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

  renderError(error) {
    switch (error.status) {
      case 401: // Unauthorized
        return (
          <ErrorPage
            context={error.context}
            message="Github didn't accept the access token"
            actionButton="Reset access token"
            onActionButtonClick={() => {
              this.props.accessToken(false)
              this.props.history.push(pages.LOGIN)
            }}
          />
        )

      case 404: // Not found
        return (
          <ErrorPage
            context={error.context}
            message={`The gist ID '${this.props.settings.gistId}' doesn't seem to exist`}
            actionButton="Reset Gist ID"
            onActionButtonClick={() => {
              this.props.gistId(false)
              this.props.history.push(pages.SELECT_GIST)
            }}
          />
        )

      default:
        return (
          <ErrorPage
            context={error.context}
            error={error}
            message="Maybe you can fix this by changing a setting? Open an issue if this happens again."
            actionButton="Open Settings"
            onActionButtonClick={() => this.props.history.push(pages.SETTINGS)}
            link={SNIPPETS_ISSUES_URL}
          />
        )
    }
  }

  render() {
    const { snippets: snippetsState } = this.props
    if (snippetsState.loading) {
      return <Loading />
    } else if (snippetsState.error && !snippetsState.data) {
      return this.renderError(snippetsState.error)
    } else if (!snippetsState.data) {
      return (
        <ErrorPage
          title="No snippets are loaded"
          message="Maybe you changed your Gist ID or access token? In that case, you'll need to reload the Gist"
          actionButton="Reload"
          onActionButtonClick={this.props.loadSnippets}
        />
      )
    } else {
      return this.renderMain(snippetsState.data)
    }
  }
}

const mapStateToProps = (state, props) => ({
  settings: state.settings,
  snippets: {
    loading: state.snippets.loading,
    error: state.snippets.error,
    data:
      state.snippets.data
        ? Object.entries(state.snippets.data)
          .reduce((snippets, [name, snippet]) => {
            if (!snippet.deleted) {
              snippets[name] = snippet
            }
            return snippets
          }, {})
        : state.snippets.data
  },
  saveStatus:
    state.snippets.saving
      ? saveStatus.SAVING
      : state.snippets.data
        ? Object.entries(state.snippets.data)
          .find(([name, { content: { local, remote }, deleted, renamed }]) => {
            const unsaved = local !== remote || deleted || renamed
            return unsaved
          })
          ? saveStatus.UNSAVED
          : saveStatus.SAVED
        : saveStatus.SAVED
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    createSnippet,
    renameSnippet,
    updateSnippet,
    deleteSnippet,
    saveSnippets,
    loadSnippets,
    accessToken: settingsActions.accessToken,
    gistId: settingsActions.gistId
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
