import React from 'react'
import Button from 'material-ui/Button'

const renderTitle = (context, title) => (
  <h1>
    {
      context
        ? 'Failed to ' + context
        : title
        || 'Error'
    }
  </h1>
)

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
  return (
    <div className="error">
      {renderTitle(props.context, props.title)}
      <p>{props.message.toString()}</p>
      {renderError(props.error)}
      {renderAction(props.action, props.actionButton, props.onActionButtonClick)}
      {renderLink(props.link)}
    </div>
  )
}

export default ErrorPage
