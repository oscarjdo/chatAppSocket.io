import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { IoDocument } from "react-icons/io5";
import { BiSolidDownload } from "react-icons/bi";

import axios from "axios";
import exactSize from "../../utils/exactSize";

function Document({ data }) {
  const fileRef = useRef(null);

  const { url, who } = data;

  const [file, setFile] = useState(null);

  const { selected } = useSelector((state) => state.messageSelectState);

  const handleCreateFile = async () => {
    const response = await axios(url);
    let metadata = {
      type: response.headers.getContentType(),
    };

    let file = new File([response.data], url.split("/").at(-1), metadata);
    setFile(file);
  };

  const handleClick = () => {
    const url = URL.createObjectURL(file);

    fileRef.current.download = file.name;
    fileRef.current.href = url;
  };

  useEffect(() => {
    handleCreateFile();
  }, []);

  return (
    <a
      className={`document chat littler ${who}`}
      onClick={!selected ? handleClick : null}
      ref={fileRef}
    >
      <IoDocument className={`icon chat ${who}`} />
      <div className={`data chat ${who}`}>
        <h3>{file ? file.name : null}</h3>
        <p>Type: {file ? file.type : null}</p>
        <p>Size: {file ? exactSize(file.size) : null}</p>
        <BiSolidDownload className="icon download" />
      </div>
    </a>
  );
}

export default Document;
