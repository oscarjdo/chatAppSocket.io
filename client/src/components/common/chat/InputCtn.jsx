import { BiSolidSend } from "react-icons/bi";
import { AiOutlinePaperClip, AiFillAudio } from "react-icons/ai";
import { BsFillImageFill, BsHeadphones } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FilePreview from "./FilePreview";

import { setVideoAudio } from "../../../app/videoAudioSlice";
import { changeChatState } from "../../../app/chatSlice";
import { useSendMessageMutation } from "../../../app/queries/getMessages";
import { useGetOutOfChatMutation } from "../../../app/queries/getFriendList";
import { setReplyMessageState } from "../../../app/replyMessageSlice";

import socket from "../../../io";
import exactTime from "../../../utils/exactTime";

function InputCtn() {
  const inputRef = useRef(null);

  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);
  const replyMessageState = useSelector((state) => state.replyMessageState);

  const [mssg, setMssg] = useState("");
  const [multimedia, setMultimedia] = useState(false);
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(false);

  const dispatch = useDispatch();

  const [sendMessage] = useSendMessageMutation();
  const [getOutOfChat] = useGetOutOfChatMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const members =
      friendState.groupData && friendState.groupData.isGroup
        ? friendState.members.map((item) => item.id)
        : null;

    const formData = new FormData();

    const message = {
      userId: userState.id,
      members: members || [friendState.id],
      mssg,
      conversationId: friendState.conversationId,
      reply: replyMessageState.open
        ? {
            id: replyMessageState.messageId,
            sender: replyMessageState.messageSenderUsername,
            senderId: replyMessageState.messageSenderId,
            content: replyMessageState.messageContent,
            mimetype: replyMessageState.mimetype,

            fileData: {
              url:
                replyMessageState.mimetype == "video" ||
                replyMessageState.mimetype == "image"
                  ? replyMessageState.fileUrl
                  : null,
              duration: duration ? duration : null,
            },
          }
        : null,
    };

    formData.append("mssgData", JSON.stringify(message));

    if (file) formData.append("file", file);

    if (mssg.trim().length > 0 || file) {
      sendMessage(formData);
      socket.emit("client:reloadApp", {
        users: [members || [friendState.id], userState.id].flat(),
      });
      setMssg("");
    }

    dispatch(setVideoAudio({}));
    dispatch(setReplyMessageState({}));
    setFile(false);
    const inputs = document.getElementsByClassName("file-chat");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = null;
    }
  };

  const handleLeaveChat = () => {
    getOutOfChat({
      userId: userState.id,
      conversationId: friendState.conversationId,
    });

    setTimeout(() => {
      dispatch(changeChatState({ active: false }));
    }, 500);
  };

  const setFileType = (mimetype) => {
    if (!mimetype) return replyMessageState.messageContent;

    let text = mimetype;
    text = text[0].toUpperCase().concat(text.slice(1));

    const icon = {
      Image: ["📷", false],
      Audio: ["🔉", true],
      Video: ["🎬", true],
      Document: ["📃", false],
    };

    return `${icon[text][0]}${text} ${icon[text][1] ? duration : ""}${
      replyMessageState.messageContent
        ? ` - ${replyMessageState.messageContent}`
        : ""
    }`;
  };

  useEffect(() => {
    if (
      !replyMessageState.open ||
      (replyMessageState.mimetype != "video" &&
        replyMessageState.mimetype != "audio")
    )
      setDuration("");
  }, [replyMessageState]);

  return (friendState.groupData &&
    friendState.groupData.isGroup &&
    !friendState.me.leftGroupAt) ||
    friendState.areFriends ? (
    <div id="inputCtn">
      <div id="replyMssgCtn" className={replyMessageState.open ? "open" : ""}>
        <div className="dataCtn">
          <div>
            <p style={{ color: replyMessageState.color }}>
              {replyMessageState.messageSenderUsername}
            </p>
            <p>{setFileType(replyMessageState.mimetype)} </p>
          </div>
          {replyMessageState.mimetype == "video" ? (
            <video
              src={replyMessageState.fileUrl}
              onLoadedData={(e) =>
                setDuration(
                  exactTime(Math.round(e.target.duration), null, true)
                )
              }
            ></video>
          ) : null}

          {replyMessageState.mimetype == "audio" ? (
            <audio
              style={{ display: "none" }}
              src={replyMessageState.fileUrl}
              onLoadedData={(e) =>
                setDuration(
                  exactTime(Math.round(e.target.duration), null, true)
                )
              }
            ></audio>
          ) : null}

          {replyMessageState.mimetype == "image" ? (
            <img src={replyMessageState.fileUrl} alt="" />
          ) : null}
          <button type="button">
            <IoIosCloseCircle
              className="icon"
              onClick={() => dispatch(setReplyMessageState({}))}
            />
          </button>
        </div>
      </div>

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
            ref={inputRef}
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
            accept="image/*, video/mp4, video/webm, video/wmv"
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
    </div>
  ) : (
    <div id="input-chat-ctn" className="disabled">
      <div>
        <h2 id="is-not-friend-text">
          {friendState.groupData && friendState.groupData.isGroup
            ? "You are not a group member anymore"
            : "This user is not your friend anymore"}
        </h2>
        <p id="delete-text">
          Do you want to <span onClick={handleLeaveChat}>Leave the chat</span>?
        </p>
      </div>
    </div>
  );
}

export default InputCtn;
