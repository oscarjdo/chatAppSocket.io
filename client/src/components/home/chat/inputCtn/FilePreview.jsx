import { useSelector } from "react-redux";

import Document from "./filePreview/Document";
import ImageAndVideo from "./filePreview/ImageAndVideo";
import Audio from "./filePreview/Audio";

const FilePreview = () => {
  const filePreviewState = useSelector((state) => state.filePreviewState);

  const setComponent = () => {
    if (filePreviewState.type == "document") return <Document />;
    else if (filePreviewState.type == "imageAndVideo") return <ImageAndVideo />;
    else if (filePreviewState.type == "audio") return <Audio />;
    else return null;
  };

  return (
    <div
      id="file-preview"
      className={filePreviewState.type == "imageAndVideo" ? "down" : ""}
    >
      {setComponent()}
    </div>
  );
};

export default FilePreview;
