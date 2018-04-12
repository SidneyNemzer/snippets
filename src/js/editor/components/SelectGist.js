import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { pages } from '../constants'
import { actions as settingsActions } from '../actions/settings'
import { loadSnippets } from '../actions/snippets'

// TODO Move this to utility file
const updater =
  (key, context) =>
    newValue =>
      context.setState({
        [key]: newValue
      })

const usersGists = 'https://gist.github.com/'

class SelectGist extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gistIdInput: ''
    }

    this.updateGistIdInput = updater('gistIdInput', this)
  }

  done() {
    const { accessToken } = this.props
    this.props.gistId(this.state.gistIdInput)
    if (accessToken) {
      this.props.loadSnippets()
      this.props.history.push(pages.MAIN)
    } else {
      this.props.history.push(pages.LOGIN)
    }
  }

  render() {
    return (
      <div>
        <h1>Please enter the ID of a Gist to store snippets in</h1>
        <input
          value={this.state.gistIdInput}
          onInput={event => this.updateGistIdInput(event.target.value)}
        />
        <button onClick={() => this.done()}>Done</button>
        <p>
          <a href={usersGists} target='_blank'>
            Open GitHub Gists
          </a>
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  accessToken: state.settings.accessToken
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    gistId: settingsActions.gistId,
    loadSnippets
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectGist)
