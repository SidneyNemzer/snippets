import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadSnippets } from '../actions/snippets'

import { CSSTransitionGroup } from 'react-transition-group'
import Main from './Main'
import Settings from './Settings'
import Login from './Login'
import SelectGist from './SelectGist'

import 'typeface-roboto'
import '../../../style/main.css'
import '../../../style/settings.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showSettings: false
    }

    this.handleOpenSettings = this.handleOpenSettings.bind(this)
    this.handleCloseSettings = this.handleCloseSettings.bind(this)
  }

  componentDidMount() {
    const { accessToken, gistId } = this.props.settings
    if (accessToken && gistId) {
      this.props.loadSnippets()
    }
  }

  handleOpenSettings() {
    this.setState({
      showSettings: true
    })
  }

  handleCloseSettings() {
    this.setState({
      showSettings: false
    })
  }

  renderSettings() {
    return this.state.showSettings && (
      <Settings
        key="settings"
        handleCloseSettings={this.handleCloseSettings}
      />
    )
  }

  render() {
    if (!this.props.settings.accessToken) {
      return <Login />
    } else if (!this.props.settings.gistId) {
      return <SelectGist />
    }
    return (
      <div>
        <CSSTransitionGroup
          transitionName="view-transition"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
          {this.renderSettings()}
        </CSSTransitionGroup>
        <Main
          {...this.props}
          handleOpenSettings={this.handleOpenSettings}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  settings: state.settings
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    loadSnippets
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
