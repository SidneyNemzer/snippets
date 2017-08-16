import React from 'react'

import MenuIcon from 'material-ui-icons/Menu'

const Header = (props) => (
  <header>
    <MenuIcon />
    <span>
      {props.message}
    </span>
  </header>
)

export default Header
