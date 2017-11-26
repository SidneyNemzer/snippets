import React from 'react'
import Button from 'material-ui/Button'

const renderError = errorText => (
  errorText !== undefined
    ? typeof errorText === 'object'
      ? typeof errorText.message === 'string'
        ? <pre>{errorText.message}</pre>
        : errorText.toString()
      : <pre>{errorText}</pre>
    : false
)

const renderAction = (action, actionButton, onClick) => (
  action
    ? <p className="action">{action}</p>
    : actionButton
      ? <Button raised color="primary" onClick={onClick}>{actionButton}</Button>
      : false
)

const renderLink = link => (
  link !== undefined ? <a href={link}>{link}</a> : false
)

const ErrorPage = (props) => {
  console.error(props.message)
  return (
    <div className="error">
      <h1>{props.title}</h1>
      <p>{props.message.toString()}</p>
      {renderError(props.error)}
      {renderAction(props.action, props.actionButton, props.onActionButtonClick)}
      {renderLink(props.link)}
    </div>
  )
}

export default ErrorPage
