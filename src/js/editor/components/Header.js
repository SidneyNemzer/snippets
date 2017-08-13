import React from 'react'

const Header = (props) => (
  <header>
    <i className="material-icons">menu</i>
    <span>
      {props.message}
    </span>
  </header>
)

export default Header
