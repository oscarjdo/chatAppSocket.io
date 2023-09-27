import { BiSolidSend } from "react-icons/bi";
import { AiOutlinePaperClip, AiFillAudio } from "react-icons/ai";
import { BsFillImageFill, BsHeadphones } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FilePreview from "./FilePreview";

import { setVideoAudio } from "../../../app/videoAudioSlice";
import { useSendMessageMutation } from "../../../app/queries/getMessages";
import socket from "../../../io";

function InputCtn() {
  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);

  const [mssg, setMssg] = useState("");
  const [multimedia, setMultimedia] = useState(false);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  const [sendMessage] = useSendMessageMutation();

  const handleChange = (e) => {
    setMssg(e.target.value);
  };

  const handleOpenMultimedia = () => {
    setMultimedia(true);
    document.body.addEventListener("pointerdown", function handleEvent(e) {
      setMultimedia(false);
      document.body.removeEventListener("pointerdown", handleEvent);
    });
    document.body.addEventListener("touchstart", function handleEvent(e) {
      setMultimedia(false);
      document.body.removeEventListener("touchstart", handleEvent);
    });
  };

  const handleMultimediaChange = (e) => {
    if (!e.target.files[0].type) return;

    const data = e.target.files[0];
    const mimetype = e.target.files[0].type.split("/")[0];

    const fileToSend = { name: data.name, type: data.type, size: data.size };
    const url =
      mimetype !== "application" && mimetype !== "text"
        ? URL.createObjectURL(data)
        : null;

    if (mimetype == "application" || mimetype == "text") {
      dispatch(setVideoAudio({ file: fileToSend, url, mimetype: "document" }));
    } else {
      dispatch(setVideoAudio({ file: fileToSend, url, mimetype }));
    }

    setFile(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    const message = {
      userId: userState.id,
      mssg,
      conversationId: friendState.conversationId,
    };

    formData.append("mssgData", JSON.stringify(message));

    if (file) formData.append("file", file);

    if (mssg.trim().length > 0 || file) {
      sendMessage(formData);
      socket.emit("client:newMessage", {
        friendId: friendState.id,
        userId: userState.id,
      });
      setMssg("");
    }

    dispatch(setVideoAudio({}));
    setFile(false);
  };

  return friendState.areFriends ? (
    <form id="input-chat-ctn" onSubmit={handleSubmit}>
      <div className="textarea-ctn">
        <textarea type="text" value={mssg} onChange={handleChange} />
      </div>
      {file ? (
        <button
          type="button"
          onClick={() => {
            dispatch(setVideoAudio({}));
            setFile(false);
            const inputs = document.getElementsByClassName("file-chat");

            for (let i = 0; i < inputs.length; i++) {
              inputs[i].value = null;
            }
          }}
        >
          <MdClose id="clip-files-close-icon" />
        </button>
      ) : (
        <button type="button" onClick={handleOpenMultimedia}>
          <AiOutlinePaperClip id="clip-files-icon" />
        </button>
      )}
      <button type="submit">
        {mssg.trim().length <= 0 && !file ? (
          <AiFillAudio className="send-mssg-icon voice-note" />
        ) : (
          <BiSolidSend className="send-mssg-icon" />
        )}
      </button>
      <div id="multimedia-ctn" className={multimedia ? "active" : ""}>
        <input
          type="file"
          className="file-chat"
          name="document"
          id="document"
          accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf"
          onChange={handleMultimediaChange}
        />
        <button type="button" className="doc">
          <label htmlFor="document">
            <IoDocument className="icon" />
          </label>
        </button>

        <input
          type="file"
          className="file-chat"
          name="gallery"
          id="gallery"
          accept="image/*, video/*"
          onChange={handleMultimediaChange}
        />
        <button type="button" className="gall">
          <label htmlFor="gallery">
            <BsFillImageFill className="icon" />
          </label>
        </button>

        <input
          type="file"
          className="file-chat"
          name="audios"
          id="audios"
          accept="audio/*"
          onChange={handleMultimediaChange}
        />
        <button type="button" className="aud">
          <label htmlFor="audios">
            <BsHeadphones className="icon" />
          </label>
        </button>
      </div>
      <div id="file-preview">
        <FilePreview />
      </div>
    </form>
  ) : (
    <div id="input-chat-ctn" className="disabled">
      <div>
        <h2 id="is-not-friend-text">This user is not your friend anymore</h2>
        <p id="delete-text">
          Do you want to <span>Leave the chat</span>?
        </p>
      </div>
    </div>
  );
}

export default InputCtn;
