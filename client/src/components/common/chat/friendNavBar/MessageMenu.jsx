import { IoIosArrowBack } from "react-icons/io";
import { TbStarFilled, TbStarOff } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import { BiSolidCopy, BiSolidShare } from "react-icons/bi";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectMessage } from "../../../../app/messageSelectSlice";
import { setModalState } from "../../../../app/modalSlice";

import {
  useAddFeaturedMessageMutation,
  useRemoveFeaturedMessageMutation,
} from "../../../../app/queries/getMessages";
import { setForwardMssgMenuState } from "../../../../app/forwardMssgMenuSlice";

function MessageMenu() {
  const [justFeatured, setJustFeatured] = useState(false);

  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);
  const { selected, messages } = useSelector(
    (state) => state.messageSelectState
  );

  const dispatch = useDispatch();

  const [addFeaturedMessage] = useAddFeaturedMessageMutation();
  const [removeFeaturedMessage] = useRemoveFeaturedMessageMutation();

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
          onClick={() => dispatch(setModalState({ open: true, type: "trash" }))}
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
  );
}

export default MessageMenu;
