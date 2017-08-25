import React from 'react'

import { CSSTransitionGroup } from 'react-transition-group'
import Main from './Main'
import Settings from './Settings'

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
    if (this.state.showSettings)
      return (
        <Settings
          key="settings"
          handleCloseSettings={this.handleCloseSettings}
        />
      )
  }

  render() {
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

export default App
