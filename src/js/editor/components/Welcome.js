import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'material-ui/Button'

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
      Snippets are now stored in a Github Gist, so you&apos;ll need
      to authenticate with Github.
    </p>
    <p>
      (You can import snippets from Chrome storage in the settings, after you login)
    </p>
    <Link to={pages.LOGIN} style={{ textDecoration: 'none' }}>
      <Button raised color="primary">Login</Button>
    </Link>
  </div>
)

export default Welcome
