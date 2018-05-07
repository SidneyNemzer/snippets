import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import { pages } from '../constants'
import { actions as settingsActions } from '../actions/settings'
import { loadSnippets } from '../actions/snippets'

const usersGists = 'https://gist.github.com/'

class SelectGist extends React.Component {
  state = {
    gistIdInput: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  componentWillReceiveProps({ settingsGistId: nextGistId }) {
    const { accessToken, settingsGistId } = this.props
    if (nextGistId && nextGistId !== settingsGistId) {
      if (accessToken) {
        this.props.loadSnippets()
        this.props.history.push(pages.MAIN)
      } else {
        this.props.history.push(pages.LOGIN)
      }
    }
  }

  render() {
    return (
      <div style={{ maxWidth: 700, margin: '10vh auto', textAlign: 'center' }}>
        <h1>Choose a Gist</h1>
        <p>Please enter the ID of the Gist to store snippets in</p>
        <TextField
          label="Enter Gist ID"
          value={this.state.gistIdInput}
          onChange={this.handleChange('gistIdInput')}
        />
        <Button
          raised
          color="primary"
          onClick={() => this.props.gistId(this.state.gistIdInput)}
        >
          Save
        </Button>
        <p style={{ color: 'gray' }}>
          Example: <code>5d23ba1a3905cc6e7365bcc00e307069</code><br />
          Please don't enter the full URL!
        </p>
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
  accessToken: state.settings.accessToken,
  settingsGistId: state.settings.gistId
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    gistId: settingsActions.gistId,
    loadSnippets
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectGist)
