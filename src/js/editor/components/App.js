import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  MemoryRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'

import { pages } from '../constants'
import { loadSnippets } from '../actions/snippets'
import Main from './Main'
import Settings from './Settings'
import Login from './Login'
import SelectGist from './SelectGist'
import Welcome from './Welcome'

import 'typeface-roboto'
import '../../../style/main.css'
import '../../../style/settings.css'

class App extends React.Component {
  componentDidMount() {
    const { accessToken, gistId } = this.props.settings
    if (accessToken && gistId) {
      this.props.loadSnippets()
    }
  }

  // Choose a page based whether or not a Gist ID and token have
  // been entered
  choosePage() {
    const { accessToken, gistId } = this.props.settings
    return !accessToken && !gistId
      ? pages.WELCOME
      : !accessToken
        ? pages.LOGIN
        : !gistId
          ? pages.SELECT_GIST
          : pages.MAIN
  }

  renderSettings() {
    return this.state.page === pages.SETTINGS && (
      <Settings
        key="settings"
        handleCloseSettings={this.handleCloseSettings}
      />
    )
  }

  renderLogin() {
    return this.state.page === pages.LOGIN && (
      <Login />
    )
  }

  renderSelectGist() {
    return this.state.page === pages.SELECT_GIST && (
      <SelectGist />
    )
  }

  render() {
    return (
      <Router>
        <div>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route path={pages.WELCOME} component={Welcome} />
            <Route path={pages.LOGIN} component={Login} />
            <Route path={pages.SELECT_GIST} component={SelectGist} />
            <Route path={pages.MAIN} component={Main} />
            <Route path={pages.SETTINGS} component={Settings} />
            <Redirect from="/" to={this.choosePage()} exact />
          </AnimatedSwitch>
        </div>
      </Router>
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
