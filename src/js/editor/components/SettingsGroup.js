import React from 'react'

import Paper from 'material-ui/Paper'

const SettingsGroup = (props) => (
  <div className="settings-group">
    <h2>{props.label}</h2>
    <Paper>
      {props.children}
    </Paper>
  </div>
)

export default SettingsGroup
