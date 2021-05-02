import Button from "@material-ui/core/Button";
import React from "react";

const renderTitle = (
  context: string | undefined,
  title: string | undefined
) => {
  if (context) {
    return <h1>Failed to {context}</h1>;
  } else if (title) {
    return <h1>{title}</h1>;
  } else {
    return <h1>Error</h1>;
  }
};

const renderError = (error: string | Error | undefined) => {
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

const renderAction = (
  action: string | undefined,
  actionButton: string | undefined,
  onClick: (() => void) | undefined
) => {
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

const renderLink = (link: string | undefined) =>
  link && <a href={link}>{link}</a>;

type Props = {
  context?: string;
  title?: string;
  error?: string | Error;
  link?: string;
  message?: string;
  action?: string;
  actionButton?: string;
  onActionButtonClick?: () => void;
};

const ErrorPage: React.FC<Props> = (props) => (
  <div className="error">
    {renderTitle(props.context, props.title)}
    {props.message && <p>{props.message}</p>}
    {renderError(props.error)}
    {renderAction(props.action, props.actionButton, props.onActionButtonClick)}
    {renderLink(props.link)}
  </div>
);

export default ErrorPage;
