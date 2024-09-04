import React, { useRef, useState } from "react";

import { BiPlay } from "react-icons/bi";

function VideoPrev({ item, data }) {
  const canvTarget = useRef(null);
  const vidTarget = useRef(null);

  const [image, setImage] = useState("");

  const handleCapture = () => {
    const video = vidTarget.current;
    const canvas = canvTarget.current;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 16 * 3, 16 * 3);

    const canvasData = canvas.toDataURL("image/jpeg");

    setImage(canvasData);
  };

  return (
    <div className="videoItem">
      <video
        ref={vidTarget}
        className="videoCanvas"
        src={item.url}
        onLoadedMetadata={handleCapture}
      ></video>

      <canvas
        ref={canvTarget}
        className="cameraCanvas"
        width={16 * 3}
        height={16 * 3}
      ></canvas>
      <img src={image || "/profile-img.jpg"} alt="canvas photo" />
      <BiPlay className="icon" />
    </div>
  );
}

export default VideoPrev;
