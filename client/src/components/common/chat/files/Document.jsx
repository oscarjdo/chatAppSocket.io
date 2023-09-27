import { IoDocument } from "react-icons/io5";
import { BiSolidDownload } from "react-icons/bi";

import { useEffect, useRef, useState } from "react";

import axios from "axios";

function Document({ data }) {
  const fileRef = useRef(null);

  const { url, who } = data;

  const [file, setFile] = useState(null);
  const [exactSize, setExactSize] = useState("");

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

  useEffect(() => {
    if (!file) return;

    let size = file.size;
    const fileExt = ["Bytes", "KB", "MB", "GB"];
    let i = 0;

    while (size > 900) {
      size /= 1024;
      i++;
    }

    setExactSize(`${Math.round(size * 100) / 100} ${fileExt[i]}`);
  }, [file]);

  return (
    <a
      className={`document chat littler ${who}`}
      onClick={handleClick}
      ref={fileRef}
    >
      <IoDocument className={`icon chat ${who}`} />
      <div className={`data chat ${who}`}>
        <h3>{file ? file.name : null}</h3>
        <p>Type: {file ? file.type : null}</p>
        <p>Size: {file ? exactSize : null}</p>
        <BiSolidDownload className="icon download" />
        {/* <h3>{videoAudioState.file.name || "x"}</h3>
        <p>Type: {videoAudioState.file.type || "x"}</p>
        <p>Size: {exactSize || "x"}</p> */}
      </div>
    </a>
  );
}

export default Document;
