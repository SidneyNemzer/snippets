import Paper from "@material-ui/core/Paper";
import React from "react";

type Props = {
  className?: string;
  label: string;
};

const SettingsGroup: React.FC<Props> = ({
  className = "",
  label,
  children,
}) => (
  <div className={"settings-group " + className}>
    <h2>{label}</h2>
    <Paper>{children}</Paper>
  </div>
);

export default SettingsGroup;
