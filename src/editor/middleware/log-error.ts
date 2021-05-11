import { Middleware } from "redux";

const logError: Middleware = (store) => (next) => (action) => {
  if (action.error) {
    if (action.error.context) {
      console.error("Failed to " + action.error.context, action.error);
    } else {
      console.error(action.error);
    }
  }
  next(action);
};

export default logError;
