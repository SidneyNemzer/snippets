import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { accessToken } from '../actions/settings'
import { loadSnippets } from '../actions/snippets'

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

  done() {
    this.props.accessToken(this.state.accessTokenInput)
    this.props.loadSnippets()
  }

  render() {
    return (
      <div>
        <h1>Please enter a GitHub personal access token</h1>
        <input
          value={this.state.accessTokenInput}
          onInput={event => this.updateAccessTokenInput(event.target.value)}
        />
        <button onClick={() => this.done()}>Done</button>
        <p>You can make one <a href={accessTokenUrl} target='_blank'>here</a></p>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    accessToken,
    loadSnippets
  }, dispatch)

export default connect(null, mapDispatchToProps)(Login)
