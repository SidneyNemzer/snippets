import React from "react";
import Button from "@material-ui/core/Button";

const renderTitle = (context, title) => {
  if (context) {
    return <h1>Failed to {context}</h1>;
  } else if (title) {
    return <h1>{title}</h1>;
  } else {
    return <h1>Error</h1>;
  }
};

const renderError = error => {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return <pre>{error}</pre>;
  }

  if (error.message) {
    return <pre>{error.message}</pre>;
  }

  return error.toString();
};

const renderAction = (action, actionButton, onClick) => {
  if (action) {
    return <p className="action">{action}</p>;
  } else if (actionButton) {
    return (
      <Button variant="contained" color="primary" onClick={onClick}>
        {actionButton}
      </Button>
    );
  }
};

const renderLink = link => link && <a href={link}>{link}</a>;

const ErrorPage = props => (
  <div className="error">
    {renderTitle(props.context, props.title)}
    {props.message && <p>{props.message}</p>}
    {renderError(props.error)}
    {renderAction(props.action, props.actionButton, props.onActionButtonClick)}
    {renderLink(props.link)}
  </div>
);

export default ErrorPage;
