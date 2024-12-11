import React from "react";

function CircularLoader({ loaded }) {
  return (
    <div id="circular-loader-ctn" className={loaded ? "out" : ""}>
      <span></span>
    </div>
  );
}

export default CircularLoader;
