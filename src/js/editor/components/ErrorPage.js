import React from 'react'

const ErrorPage = (props) => (
  <div className="error">
    <h1>{props.title}</h1>
    <p>{props.message}</p>
    <pre>{props.error}</pre>
    <p className="action">{props.action}</p>
    <a href={props.link}>{props.link}</a>
  </div>
)

export default ErrorPage
