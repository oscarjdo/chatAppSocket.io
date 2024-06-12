import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setForwardMssgMenuState } from "../../../app/forwardMssgMenuSlice";

import { useSendMessageMutation } from "../../../app/queries/getMessages";

import socket from "../../../io";

function FriendListMenu() {
  const userState = useSelector((state) => state.userState);
  const { list } = useSelector((state) => state.friendListState);
  const { open, messages } = useSelector((state) => state.forwardMssgMenuState);

  const [sent, setSent] = useState(Array(list.length).fill(false));

  const dispatch = useDispatch();

  const [sendMessage] = useSendMessageMutation();

  const handleClick = async (item, index) => {
    setSent(sent.map((it, i) => (i == index ? true : it)));

    try {
      messages.map((it) => {
        const formData = new FormData();

        const message = {
          userId: userState.id,
          members: [item.userId],
          mssg: it.content,
          conversationId: item.conversationId,
          reply: null,
          forwarded: { res: true, fileUrl: it.fileUrl, mimetype: it.mimetype },
        };

        formData.append("mssgData", JSON.stringify(message));

        setTimeout(() => {
          sendMessage(formData);

          socket.emit("client:reloadApp", {
            users: [item.userId, userState.id],
          });
        }, 1000);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={open ? "active" : ""} id="friendListMenu">
      <div className="friendListMenuNav">
        <IoIosArrowBack
          className="icon"
          onClick={() => {
            dispatch(setForwardMssgMenuState({}));
            setSent(Array(list.length).fill(false));
          }}
        />
        <h3>Forward Message</h3>
      </div>

      <ul className="friendListMenu">
        {list.map((item, index) => {
          return (
            <li key={index}>
              <div
                className="photo"
                style={{
                  "--p": item.imgUrl
                    ? `url("${item.imgUrl}")`
                    : "url('/profile-img.jpg')",
                }}
              ></div>

              <div className="data">
                <p>{item.username}</p>
                <p>User ID: {item.userId}</p>
              </div>

              {!sent[index] ? (
                <button
                  className={sent[index] ? "sent" : ""}
                  type="button"
                  onClick={() => handleClick(item, index)}
                >
                  <IoIosArrowBack className="icon" />
                </button>
              ) : (
                <button className={sent[index] ? "sent" : ""} type="button">
                  <IoIosArrowBack className="icon" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FriendListMenu;
