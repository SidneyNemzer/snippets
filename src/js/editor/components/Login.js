import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { pages, CREATE_ACCESS_TOKEN_URL } from '../constants'
import { actions as settingsActions } from '../actions/settings'
import { loadSnippets } from '../actions/snippets'

// TODO Move this to utility file
const updater =
  (key, context) =>
    newValue =>
      context.setState({
        [key]: newValue
      })

const accessTokenUrl = 'https://github.com/settings/tokens/new?description=Snippets%20Access%20Token&scopes=gist'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      accessTokenInput: ''
    }

    this.updateAccessTokenInput = updater('accessTokenInput', this)
  }

  componentWillReceiveProps({ settingsAccessToken: nextAccessToken }) {
    const { gistId, settingsAccessToken } = this.props
    console.log('componentWillReceiveProps', nextAccessToken, settingsAccessToken)
    if (nextAccessToken && nextAccessToken !== settingsAccessToken) {
      if (gistId) {
        this.props.loadSnippets()
        this.props.history.push(pages.MAIN)
      } else {
        this.props.history.push(pages.SELECT_GIST)
      }
    }
  }

  submitAccessToken() {
    this.props.accessToken(this.state.accessTokenInput)
  }

  render() {
    return (
      <div>
        <h1>Please enter a GitHub personal access token</h1>
        <input
          value={this.state.accessTokenInput}
          onInput={event => this.updateAccessTokenInput(event.target.value)}
        />
        <button onClick={() => this.submitAccessToken()}>Done</button>
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
