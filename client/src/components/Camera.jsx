import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoIosArrowBack } from "react-icons/io";
import { BsFillImageFill } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { BiCheck } from "react-icons/bi";

import { setCameraState } from "../app/cameraSlice";
import { setImageSelectorState } from "../app/imageSelectorSlice";
import { setCameraFiles } from "../app/filePreviewSlice";

function Camera() {
  const videoTarget = useRef();
  const canvasTarget = useRef();
  let { current: timer } = useRef();

  const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState([]);
  const [sizes, setSizes] = useState({});
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [recording, setRecording] = useState(false);

  const { open, to } = useSelector((state) => state.cameraState);

  const dispatch = useDispatch();

  const getUserMedia = async () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        videoTarget.current.srcObject = stream;
        setMediaStream(stream);
        setMediaRecorder(new MediaRecorder(stream));
      })
      .catch((err) => console.error(err));
  };

  const handleCloseCamera = () => {
    mediaStream.getTracks().map((item) => {
      item.stop();
      mediaStream.removeTrack(item);
    });

    dispatch(setCameraState({ open: false, to: "" }));
    setLoaded(false);
    setImage([]);
  };

  const handleCapture = () => {
    if (image.length >= 10) return;

    const type = "image/jpeg";

    const context = canvasTarget.current.getContext("2d");
    context.drawImage(videoTarget.current, 0, 0, sizes.width, sizes.height);

    const data = canvasTarget.current.toDataURL(type);

    setImage(image.concat({ data, type: type }));
  };

  const handleTouchStart = () => {
    timer = setTimeout(() => {
      setRecording(true);
      mediaRecorder.start(1000);

      mediaRecorder.ondataavailable = (e) => {
        const mediaDataArr = mediaData;
        mediaDataArr.push(e.data);
        setMediaData(mediaDataArr);
      };

      mediaRecorder.onstop = async (e) => {
        const type = "video/mp4";

        setRecording(false);

        const file = new File(mediaData, "video", { type });

        const url = URL.createObjectURL(file);

        setImage(image.concat({ data: url, type }));

        setMediaData([]);
      };

      timer = null;
    }, 1000);
  };

  const handleTouchEnd = () =>
    timer ? clearTimeout(timer) : mediaRecorder.stop();

  const handleRetry = () => {
    setImage([]);
  };

  const handleLike = () => {
    if (to == "galleryOrCamera") {
      dispatch(
        setImageSelectorState({
          file: {
            url: image[0],
            name: "CaptureSocketApp",
            mimetype: "image/jpg",
          },
        })
      );
    } else if (to == "inputChat") {
      let arr = [];

      image.map((item, index) => {
        const id = `${Date.now() * Math.random()}/-/chatAppSocketIo$${
          item.type
        }${index}^itemIndex${index}`;

        const mimetype = item.type;

        const fileToSend = {
          name: `chatAppSocketIo$capture${index}`,
          type: mimetype,
          id,
        };

        arr.push({
          file: fileToSend,
          url: item.data,
          mimetype: mimetype.split("/")[0],
        });
      });

      dispatch(
        setCameraFiles({
          data: arr,
          type: "imageAndVideo",
        })
      );
    }

    handleCloseCamera();
  };

  const selectBttns = () => {
    if (to == "galleryOrCamera") {
      return image.length ? (
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
      );
    }
    if (to == "inputChat") {
      return (
        <>
          {image.length ? (
            <button
              type="button"
              className="bttn picsEnough"
              onClick={handleLike}
            >
              <BsFillImageFill className="icon" />
              <span>{image.length}</span>
            </button>
          ) : null}
          <button
            type="button"
            id="capture"
            className="bttn"
            style={{ backgroundColor: recording ? "red" : null }}
            onClick={handleCapture}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          ></button>
        </>
      );
    }
  };

  useEffect(() => {
    if (open) {
      getUserMedia();
    }
  }, [open]);

  return (
    <div id="camera" className={open ? "active" : ""}>
      <button type="button" onClick={handleCloseCamera}>
        <IoIosArrowBack className="icon" />
      </button>

      <video
        id="cameraVideo"
        ref={videoTarget}
        className={image.length && to == "galleryOrCamera" ? "inactive" : ""}
        autoPlay
        onLoadedMetadata={() => {
          setLoaded(true);

          setSizes({
            width: videoTarget.current.offsetWidth,
            height: videoTarget.current.offsetHeight,
          });
        }}
      ></video>

      <canvas
        id="cameraCanvas"
        ref={canvasTarget}
        className={image.length && to == "galleryOrCamera" ? "active" : ""}
        width={sizes.width}
        height={sizes.height}
      >
        <img src={to == "galleryOrCamera" ? image[0] : ""} alt="" />
      </canvas>

      <div id="cameraBttnsCtn">{loaded ? selectBttns() : null}</div>
    </div>
  );
}

export default Camera;
