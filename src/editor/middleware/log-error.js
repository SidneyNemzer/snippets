export default store => next => action => {
  if (action.error) {
    if (action.error.context) {
      console.error("Error: failed to " + action.error.context);
    } else {
      console.error("Error (no context)");
    }
    console.error(action.error);
  }
  next(action);
};
