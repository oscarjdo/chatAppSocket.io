import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoIosArrowBack } from "react-icons/io";

import { setOptionsState } from "../../../app/optionsSlice";
import { changeChatState } from "../../../app/chatSlice";
import { setScrollToState } from "../../../app/scrollToSlice";

import axios from "axios";

function FeaturedMessages() {
  const userState = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const getFeaturedMessages = async () => {
    const response = await axios.get(
      `http://localhost:3000/getFeaturedMessages/${userState.id}`
    );

    setData(response.data);
  };

  const handleGoToMessage = (item) => {
    dispatch(
      changeChatState({
        active: true,
        conversationId: item.conversation_id,
      })
    );
    dispatch(
      setScrollToState({ to: `messageId${item.message_id}`, time: 800 })
    );

    setTimeout(() => {
      dispatch(setOptionsState({}));
    }, 800);
  };

  useEffect(() => {
    getFeaturedMessages();
  }, []);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  return (
    <>
      <div id="FeMeNav">
        <IoIosArrowBack
          className="icon"
          onClick={() => dispatch(setOptionsState({}))}
        />
        <h3>Featured Messages</h3>
      </div>
      <ul id="FeMeLi">
        {data.map((item, index) => {
          return (
            <li key={index}>
              <div
                className="photo"
                style={{
                  "--p": `url("${
                    item.isGroup
                      ? item.img_url_group || "group-photo.jpg"
                      : item.img_url || "profile-img.jpg"
                  }")`,
                }}
              />
              <div>
                <h3>
                  {item.senderId == userState.id
                    ? `You > ${item.group_name || item.username}`
                    : `${item.senderUsername} > ${item.group_name || "You"}`}
                </h3>
                <p>{item.content}</p>
              </div>
              <IoIosArrowBack
                className="icon"
                onClick={() => handleGoToMessage(item)}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default FeaturedMessages;
