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
    const {
      settings: { accessToken, gistId },
      snippets: { data }
    } = this.props
    if (!data && accessToken && gistId) {
      this.props.loadSnippets()
    }
  }

  // Choose a page based whether or not a Gist ID and token have
  // been entered
  choosePage() {
    const { accessToken, gistId } = this.props.settings
    if (!accessToken && !gistId) {
      return pages.WELCOME
    } else if (!accessToken) {
      return pages.LOGIN
    } else if (!gistId) {
      return pages.SELECT_GIST
    } else {
      return pages.MAIN
    }
  }

  render() {
    return (
      <Router>
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
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  snippets: state.snippets
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    loadSnippets
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
