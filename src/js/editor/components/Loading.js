import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "10vh"
    }}
  >
    <h1 style={{ marginRight: "10px" }}>Loading</h1>
    <CircularProgress />
  </div>
);

export default Loading;
