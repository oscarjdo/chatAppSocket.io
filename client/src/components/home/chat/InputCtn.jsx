import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BiSolidSend } from "react-icons/bi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsFillImageFill, BsHeadphones } from "react-icons/bs";
import { IoCamera, IoDocument } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import {
  setCameraFiles,
  setFileToPreview,
  setTexts,
} from "../../../app/filePreviewSlice";
import { setReplyMessageState } from "../../../app/replyMessageSlice";
import { setCameraState } from "../../../app/cameraSlice";
import { setNotiState } from "../../../app/notiSlice";
import { setSideMenusState } from "../../../app/sideMenusSlice";
import { setImageSelectorState } from "../../../app/imageSelectorSlice";

import { useSendMessageMutation } from "../../../app/queries/getMessages";

import FilePreview from "./inputCtn/FilePreview";
import ReplyMssgCtn from "./inputCtn/ReplyMssgCtn";
import NotFriendTextCtn from "./inputCtn/NotFriendTextCtn";
import VoiceNoteBttn from "./inputCtn/VoiceNoteBttn";

import socket from "../../../io";
import { useEffect } from "react";

function InputCtn() {
  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);
  const replyMessageState = useSelector((state) => state.replyMessageState);
  const { type } = useSelector((state) => state.sideMenusState);
  const {
    mssgs,
    type: filePreviewType,
    data,
    idToDelete,
    cameraFiles,
  } = useSelector((state) => state.filePreviewState);

  const [mssg, setMssg] = useState("");
  const [files, setFiles] = useState([]);
  const [members, setMembers] = useState(null);
  const [isGroup, setIsGroup] = useState(null);

  const dispatch = useDispatch();

  const [sendMessage] = useSendMessageMutation();

  const handleChange = (e) => {
    setMssg(e.target.value);
  };

  const handleDocumentChange = (e) => {
    if (!e.target.files) return;

    const input = e.target;
    const dataFile = e.target.files[0];

    const mimetype = dataFile.type.split("/")[0];

    if (mimetype !== "application" && mimetype !== "text")
      return dispatch(
        setNotiState({
          active: true,
          text: "The set file in field is not a document.",
          type: "WARNING",
        })
      );

    const fileToSend = {
      name: dataFile.name,
      type: dataFile.type,
      size: dataFile.size,
    };

    setFiles([{ file: dataFile }]);
    dispatch(
      setFileToPreview({
        data: [{ file: fileToSend }],
        type: "document",
      })
    );

    input.value = null;
  };

  const handleImageVideoChange = (e) => {
    if (!e.target.files) return;

    const dataFiles = e.target.files;

    const filesToView = [];

    const newFiles = Object.values(dataFiles)
      .flat()
      .map((item, index) => {
        if (index >= 10) return;

        const id = `${Date.now() * Math.random()}/-/${item.name}^${item.size}`;

        const mimetype = item.type.split("/")[0];

        const fileToSend = {
          name: item.name,
          type: item.type,
          size: item.size,
          id,
        };

        const url =
          mimetype !== "application" && mimetype !== "text"
            ? URL.createObjectURL(item)
            : null;

        filesToView.push({ file: fileToSend, url, mimetype });

        return { id, file: item };
      })
      .filter((item) => item);

    setFiles(files.concat(newFiles));
    dispatch(
      setFileToPreview({
        data: data.concat(filesToView),
        type: "imageAndVideo",
      })
    );

    e.target.value = null;
  };

  const handleAudioChange = (e) => {
    if (!e.target.files) return;

    const input = e.target;
    const dataFile = e.target.files[0];

    const mimetype = dataFile.type.split("/")[0];
    let url;

    if (mimetype == "application" && mimetype == "text")
      return dispatch(
        setNotiState({
          active: true,
          text: "The set file in field is not an audio.",
          type: "WARNING",
        })
      );
    else url = URL.createObjectURL(dataFile);

    const fileToSend = {
      name: dataFile.name,
      type: dataFile.type,
      size: dataFile.size,
    };

    setFiles([{ file: dataFile }]);
    dispatch(
      setFileToPreview({
        data: [{ file: fileToSend, url }],
        type: "audio",
      })
    );

    input.value = null;
  };

  const handleCamera = () => {
    dispatch(setCameraState({ open: true, to: "inputChat" }));
  };

  const createMessage = (item, index) => {
    const formData = new FormData();

    const setMssg = () => {
      if (filePreviewType == "imageAndVideo") return mssgs[item.id] || "";
      else if (filePreviewType == "audio") return "";
      else return mssg;
    };

    const message = {
      userId: userState.id,
      members: members || [friendState.id],
      mssg: setMssg(),
      conversationId: friendState.conversationId,
      isGroup,
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
              duration: replyMessageState.duration
                ? replyMessageState.duration
                : null,
            },
          }
        : null,
      forwarded: { res: false },
    };

    formData.append("mssgData", JSON.stringify(message));
    if (item) formData.append("file", item.file);
    if (mssg.trim().length > 0 || item.file) {
      return formData;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let createdMssgs;

    if (files.length) {
      createdMssgs = files.map((item, index) => createMessage(item, index));
    } else {
      createdMssgs = [createMessage()];
    }

    createdMssgs.map((item) => sendMessage(item));

    setTimeout(() => {
      socket.emit("client:reloadApp", {
        users: [members || [friendState.id], userState.id].flat(),
        place: "inputCtn.jsx",
      });
    }, 500);

    setMssg("");
    dispatch(setTexts({ clear: true }));

    setFiles([]);
    dispatch(setFileToPreview({}));

    dispatch(setReplyMessageState({}));
  };

  useEffect(() => {
    if (data.length < files.length) {
      setFiles(files.filter((item) => item.id !== idToDelete));
    }
  }, [idToDelete]);

  useEffect(() => {
    if (data.length <= 0) setFiles([]);
  }, [data]);

  const createFiles = () => {
    const filesToSend = [];
    const filesToView = [];

    cameraFiles.map(async (item, index, arr) => {
      const res = await fetch(item.url);
      const createdFile = new File([await res.arrayBuffer()], item.file.name, {
        type: item.file.type,
      });

      filesToSend.push({ id: item.file.id, file: createdFile });

      const fileUrl = URL.createObjectURL(createdFile);

      filesToView.push({
        ...item,
        url: fileUrl,
        file: { ...item.file, size: createdFile.size },
      });

      if (index + 1 == arr.length) {
        setFiles(files.concat(filesToSend));

        dispatch(
          setFileToPreview({
            data: filesToView,
            type: "imageAndVideo",
          })
        );

        dispatch(setCameraFiles({ data: [] }));
      }
    });
  };

  useEffect(() => {
    if (cameraFiles.length) createFiles();
  }, [cameraFiles]);

  useEffect(() => {
    setIsGroup(friendState.groupData && friendState.groupData.isGroup);
    setMembers(isGroup ? friendState.members.map((item) => item.id) : false);

    () => {};
  }, [friendState, isGroup]);

  return (friendState.groupData &&
    friendState.groupData.isGroup &&
    !friendState.me.leftGroupAt) ||
    friendState.areFriends ? (
    <div id="inputCtn">
      <ReplyMssgCtn />

      <form id="input-chat-ctn" onSubmit={handleSubmit}>
        <h4>Sure to send this?</h4>
        <div
          className={`${
            filePreviewType == "audio" ? "collapsed" : ""
          } textarea-ctn`}
        >
          <textarea
            type="text"
            value={mssg}
            placeholder="Say something"
            onChange={handleChange}
          />
        </div>
        {files.length >= 1 ? (
          <button
            type="button"
            className={filePreviewType == "audio" ? "rounded" : ""}
            onClick={() => {
              dispatch(setFileToPreview({}));
              setFiles([]);
              const inputs = document.getElementsByClassName("file-chat");

              for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = null;
              }
            }}
          >
            <MdClose id="clip-files-close-icon" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              dispatch(setSideMenusState({ type: "multimediaChatMenu" }))
            }
          >
            <AiOutlinePaperClip id="clip-files-icon" />
          </button>
        )}
        {mssg.trim().length <= 0 && files.length <= 0 ? (
          <VoiceNoteBttn />
        ) : (
          <button type="submit">
            <BiSolidSend className="send-mssg-icon" />
          </button>
        )}
        <div
          id="multimedia-ctn"
          className={type == "multimediaChatMenu" ? "active" : ""}
        >
          <input
            type="file"
            className="file-chat"
            name="document"
            id="document"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf"
            onChange={handleDocumentChange}
          />
          <button type="button" className="midColorBttn one">
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
            multiple
            onChange={handleImageVideoChange}
          />

          <button type="button" className="midColorBttn two">
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
            onChange={handleAudioChange}
          />
          <button type="button" className="midColorBttn three">
            <label htmlFor="audios">
              <BsHeadphones className="icon" />
            </label>
          </button>

          <button
            type="button"
            className="midColorBttn bigger"
            onClick={handleCamera}
          >
            <IoCamera className="icon" />
          </button>
        </div>
        <FilePreview />
      </form>
    </div>
  ) : (
    <NotFriendTextCtn />
  );
}

export default InputCtn;
