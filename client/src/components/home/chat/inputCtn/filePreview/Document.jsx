import React from "react";
import { useSelector } from "react-redux";

import { IoDocument } from "react-icons/io5";

import exactSize from "../../../../../utils/exactSize";

function Document() {
  const { data } = useSelector((state) => state.filePreviewState);

  return (
    <div className="document">
      <IoDocument className="icon" />
      <div className="data">
        <h3>{data[0].file.name || "x"}</h3>
        <p>Type: {data[0].file.type || "x"}</p>
        <p>Size: {exactSize(data[0].file.size) || "x"}</p>
      </div>
    </div>
  );
}

export default Document;
