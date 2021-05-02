import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";

const Loading: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "10vh",
    }}
  >
    <h1 style={{ marginRight: "10px" }}>Loading</h1>
    <CircularProgress />
  </div>
);

export default Loading;
