import React from 'react'
import { Link } from 'react-router-dom'

import { pages } from '../constants'

const Welcome = props => (
  <div>
    <h1>Welcome to Snippets 2.0!</h1>
    <p>
      Snippets are now stored using Github Gists, so to get started you&apos;ll need
      to authenticate with Github.
    </p>
    <Link to={pages.LOGIN}><button>Login</button></Link>
  </div>
)

export default Welcome
