import { IoIosCloseCircle } from "react-icons/io";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import exactTime from "../../../../utils/exactTime";
import {
  setReplyMessageState,
  setReplyMssgDuration,
} from "../../../../app/replyMessageSlice";

function ReplyMssgCtn() {
  const replyMessageState = useSelector((state) => state.replyMessageState);

  const dispatch = useDispatch();

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

    return `${icon[text][0]}${text} ${
      icon[text][1] ? replyMessageState.duration : ""
    }${
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
      dispatch(setReplyMssgDuration(""));
  }, [replyMessageState]);

  return (
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
              dispatch(
                setReplyMssgDuration({
                  duration: exactTime(
                    Math.round(e.target.duration),
                    null,
                    true
                  ),
                })
              )
            }
          ></video>
        ) : null}

        {replyMessageState.mimetype == "audio" ? (
          <audio
            style={{ display: "none" }}
            src={replyMessageState.fileUrl}
            onLoadedData={(e) =>
              dispatch(
                setReplyMssgDuration({
                  duration: exactTime(
                    Math.round(e.target.duration),
                    null,
                    true
                  ),
                })
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
  );
}

export default ReplyMssgCtn;
