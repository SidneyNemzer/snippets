import React from "react";
import Paper from "@material-ui/core/Paper";

const SettingsGroup = props => (
  <div className={"settings-group " + (props.className || "")}>
    <h2>{props.label}</h2>
    <Paper>{props.children}</Paper>
  </div>
);

export default SettingsGroup;
