import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

import { pages } from '../constants'

import logo from '../../../../images/logo-transparent.png'

const Welcome = () => (
  <div style={{ maxWidth: 700, margin: '10vh auto', textAlign: 'center' }}>
    <img
      src={logo}
      style={{ width: '75%' }}
    />
    <h1>Welcome to Snippets 2.0!</h1>
    <p>
      Snippets are stored in a Github Gist, so you&apos;ll need
      to authenticate with Github. <br /> (We'll use an access token to do that).
    </p>
    <Link to={pages.LOGIN} style={{ textDecoration: 'none' }}>
      <Button raised color="primary">Login</Button>
    </Link>
    <p style={{ color: 'gray', fontStyle: 'italic' }}>
      Note to users Snippets before version 2.0: <br />you can import snippets from Chrome storage in the settings, after you login
    </p>
  </div>
)

export default Welcome
