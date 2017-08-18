import React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import Button from 'material-ui/Button'

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={this.props.handleCloseSettings}
            >
              <ArrowBackIcon />
            </IconButton>
            Settings
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Settings
