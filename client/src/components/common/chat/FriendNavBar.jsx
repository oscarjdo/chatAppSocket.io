import { FaPhone } from "react-icons/fa";
import { BsFillCameraVideoFill, BsFillTrashFill } from "react-icons/bs";
import { TbStarFilled, TbStarOff } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidCopy, BiSolidShare } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";

import { useDispatch, useSelector } from "react-redux";
import { changeChatState } from "../../../app/chatSlice.js";
import { selectMessage } from "../../../app/messageSelectSlice.js";
import { setModalState } from "../../../app/modalSlice.js";
import { notify } from "../../../utils/notify.js";
import { setReplyMessageState } from "../../../app/replyMessageSlice.js";
import { setSideMenusState } from "../../../app/sideMenusSlice.js";
import { setForwardMssgMenuState } from "../../../app/forwardMssgMenuSlice.js";

import { activateInfo } from "../../../app/infoSlice.js";
import {
  useAddFeaturedMessageMutation,
  useRemoveFeaturedMessageMutation,
} from "../../../app/queries/getMessages.js";
import { useEffect, useState } from "react";

function FriendNavBar() {
  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);
  const { selected, messages } = useSelector(
    (state) => state.messageSelectState
  );
  const [justFeatured, setJustFeatured] = useState(false);

  const dispatch = useDispatch();

  const [addFeaturedMessage] = useAddFeaturedMessageMutation();
  const [removeFeaturedMessage] = useRemoveFeaturedMessageMutation();

  const handleCloseChat = () => {
    dispatch(changeChatState(false));
    dispatch(setReplyMessageState({}));
  };

  const handleClickOnStar = () => {
    try {
      if (Boolean(Object.values(messages).find((item) => !item[2].featured))) {
        const keys = Object.keys(messages);
        const values = Object.values(messages);

        const filteredMessages = keys.filter(
          (item, index) => !values[index][2].featured
        );

        addFeaturedMessage({
          messageId: filteredMessages,
          conversationId: friendState.conversationId,
          userId: userState.id,
        });
      } else {
        removeFeaturedMessage({
          messageId: Object.keys(messages),
          conversationId: friendState.conversationId,
          userId: userState.id,
        });
      }
      dispatch(selectMessage({ data: false, selected: false }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setJustFeatured(
      !Boolean(Object.values(messages).find((item) => !item[2].featured))
    );
  }, [messages]);

  return (
    <div id="chat-nav">
      <div>
        <div id="info-ctn">
          <IoIosArrowBack id="back-chat-bttn" onClick={handleCloseChat} />
          <div
            id="click-info-ctn"
            onClick={() => {
              dispatch(activateInfo(true));
            }}
          >
            <div className="friend-photo-ctn">
              <div
                className="photo"
                style={
                  friendState.groupData
                    ? {
                        "--p": !friendState.groupData.isGroup
                          ? `url("${friendState.imgUrl || "/profile-img.jpg"}")`
                          : `url("${
                              friendState.groupData.img_url ||
                              "/group-photo.jpg"
                            }")`,
                      }
                    : null
                }
              ></div>
            </div>
            {friendState.groupData && !friendState.groupData.isGroup ? (
              <span
                className={`online-in-chat ${
                  friendsOnlineState.list[friendState.id] &&
                  friendState.areFriends
                    ? "active"
                    : ""
                }`}
              ></span>
            ) : null}
            <h2>
              {friendState.groupData && friendState.groupData.isGroup
                ? friendState.groupData.group_name
                : friendState.username}
            </h2>
          </div>
        </div>
        <div id="action-ctn">
          <FaPhone className="icon-action" onClick={notify} />
          <BsFillCameraVideoFill className="icon-action" onClick={notify} />

          <SlOptionsVertical
            id="icon-action-options"
            className="icon-action"
            onClick={() => dispatch(setSideMenusState({ type: "chatMenu" }))}
          />
        </div>
      </div>
      <div className={`message-menu ${selected ? "active" : ""}`}>
        <div className="little">
          <button
            type="button"
            onClick={() =>
              dispatch(selectMessage({ data: false, selected: false }))
            }
          >
            <IoIosArrowBack className="icon" />
          </button>
          <p>{Object.keys(messages).length}</p>
        </div>
        <div className="big">
          <button type="button" onClick={handleClickOnStar}>
            {justFeatured ? (
              <TbStarOff className="icon" />
            ) : (
              <TbStarFilled className="icon" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch(setModalState({ open: true, type: "trash" }))
            }
          >
            <BsFillTrashFill className="icon" />
          </button>

          <button
            type="button"
            onClick={() => {
              const messagesToForward = friendState.messages
                .filter(
                  (item) =>
                    !item.event &&
                    Object.keys(messages).includes(item.message_id.toString())
                )
                .map((item) => ({
                  content: item.content,
                  fileUrl: item.file_url,
                  mimetype: item.mimetype,
                }));

              dispatch(
                setForwardMssgMenuState({
                  open: true,
                  messages: messagesToForward,
                })
              );
            }}
          >
            <BiSolidShare className="icon turn" />
          </button>

          <button
            type="button"
            className={`${
              Object.keys(messages).length > 1 ? "disappear" : ""
            } copyBttn`}
            onClick={() => {
              navigator.clipboard.writeText(
                Object.values(messages)[0][2].content
              );

              dispatch(selectMessage({ data: false, selected: false }));
            }}
          >
            <BiSolidCopy className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendNavBar;
