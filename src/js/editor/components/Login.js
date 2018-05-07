import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import { pages, CREATE_ACCESS_TOKEN_URL } from '../constants'
import { actions as settingsActions } from '../actions/settings'
import { loadSnippets } from '../actions/snippets'

class Login extends React.Component {
  state = {
    accessTokenInput: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  componentWillReceiveProps({ settingsAccessToken: nextAccessToken }) {
    const { gistId, settingsAccessToken } = this.props
    if (nextAccessToken && nextAccessToken !== settingsAccessToken) {
      if (gistId) {
        this.props.loadSnippets()
        this.props.history.push(pages.MAIN)
      } else {
        this.props.history.push(pages.SELECT_GIST)
      }
    }
  }

  render() {
    return (
      <div style={{ maxWidth: 700, margin: '10vh auto', textAlign: 'center' }}>
        <h1>Authenticate with Github</h1>
        <p>
          In order to store snippets in a Github Gist, you'll need to provide a
          Github access token. It must have the "Gist" scope.
        </p>
        <TextField
          label="Enter access token"
          value={this.state.accessTokenInput}
          onChange={this.handleChange('accessTokenInput')}
        />
        <Button
          raised
          color="primary"
          onClick={() => this.props.accessToken(this.state.accessTokenInput)}
        >
          Save
        </Button>
        <p>You can make one <a href={CREATE_ACCESS_TOKEN_URL} target='_blank'>here</a></p>
      </div>
    )
  }
}

const mapStateToProps = ({ settings: { gistId, accessToken: settingsAccessToken } }) => ({
  gistId,
  settingsAccessToken
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    accessToken: settingsActions.accessToken,
    loadSnippets
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)
