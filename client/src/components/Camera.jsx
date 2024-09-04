import { IoIosArrowBack } from "react-icons/io";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCameraState } from "../app/cameraSlice";
import { IoCloseOutline } from "react-icons/io5";
import { BiCheck } from "react-icons/bi";
import { setImageSelectorState } from "../app/imageSelectorSlice";

function Camera() {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [image, setImage] = useState(null);
  const [sizes, setSizes] = useState({});
  const [mediaStream, setMediaStream] = useState(null);

  const { open } = useSelector((state) => state.cameraState);

  const dispatch = useDispatch();

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setMediaStream(stream);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseCamera = () => {
    dispatch(setCameraState({ open: false }));
    mediaStream.getTracks().map((item) => item.stop());
    setVideo(null);
    setCanvas(null);
    setImage(null);
  };

  const handleCapture = () => {
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, sizes.width, sizes.height);

    const data = canvas.toDataURL("image/png");

    setImage(data);
  };

  const handleRetry = () => {
    setImage(null);
  };

  const handleLike = () => {
    dispatch(
      setImageSelectorState({
        file: { url: image, name: "CaptureSocketApp", mimetype: "image/jpg" },
      })
    );

    handleCloseCamera();
  };

  useEffect(() => {
    if (open) {
      setVideo(document.getElementById("cameraVideo"));
      setCanvas(document.getElementById("cameraCanvas"));
      getUserMedia();
    }
  }, [open]);

  useEffect(() => {
    if (mediaStream && video) {
      video.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div id="camera" className={open ? "active" : ""}>
      <button type="button" onClick={handleCloseCamera}>
        <IoIosArrowBack className="icon" />
      </button>

      <video
        id="cameraVideo"
        className={image ? "inactive" : ""}
        autoPlay
        onLoadedMetadata={() =>
          setSizes({ width: video.offsetWidth, height: video.offsetHeight })
        }
      ></video>

      <canvas
        id="cameraCanvas"
        className={image ? "active" : ""}
        width={sizes.width}
        height={sizes.height}
      >
        <img src={image} alt="" />
      </canvas>

      <div id="cameraBttnsCtn">
        {image ? (
          <>
            <button type="button" className="bttn" onClick={handleRetry}>
              <IoCloseOutline className="icon" />
            </button>
            <button type="button" className="bttn" onClick={handleLike}>
              <BiCheck className="icon" />
            </button>
          </>
        ) : (
          <button
            type="button"
            id="capture"
            className="bttn"
            onClick={handleCapture}
          ></button>
        )}
      </div>
    </div>
  );
}

export default Camera;
