import React from 'react'
import { CircularProgress } from 'material-ui/Progress'

const Loading = () => (
  <div style={{ maxWidth: 700, margin: '10vh auto', textAlign: 'center' }}>
    <h1>Loading <CircularProgress /></h1>
  </div>
)

export default Loading
