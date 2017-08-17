import React from 'react'

import { CSSTransitionGroup } from 'react-transition-group'
import Main from './Main'
import Settings from './Settings'

import 'typeface-roboto'
import '../../../style/main.css'

const views = {
  MAIN: 'MAIN',
  SETTINGS: 'SETTINGS'
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: views.MAIN
    }

    this.handleOpenSettings = this.handleOpenSettings.bind(this)
  }

  handleOpenSettings() {
    this.setState({
      view: views.SETTINGS
    })
  }

  renderCurrentView() {
    switch (this.state.view) {
      case views.MAIN:
        return (
          <Main
            {...this.props}
            key={views.MAIN}
            handleOpenSettings={this.handleOpenSettings}
          />
        )

      case views.SETTINGS:
        return (
          <Settings
            key={views.SETTINGS}
          />
        )

      default:
        throw new Error('Unknown view')
    }
  }

  render() {
    return (
      <CSSTransitionGroup
        transitionName="view-transition"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.renderCurrentView()}
      </CSSTransitionGroup>
    )
  }
}

export default App
