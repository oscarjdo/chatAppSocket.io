import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectMessage } from "../../../app/messageSelectSlice";
import { setModalState } from "../../../app/modalSlice";
import {
  useDeleteMessagesForAllMutation,
  useDeleteMessagesForMeMutation,
} from "../../../app/queries/getMessages";

import socket from "../../../io";

function Modal() {
  const [canForAll, setcanForAll] = useState(true);

  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const { modalOpen } = useSelector((state) => state.modalState);
  const { messages } = useSelector((state) => state.messageSelectState);

  const dispatch = useDispatch();

  const [deleteMessagesAll] = useDeleteMessagesForAllMutation();
  const [deleteMessagesMe] = useDeleteMessagesForMeMutation();

  const deleteMessagesForAll = () => {
    deleteMessagesAll(messages);
    dispatch(selectMessage({ data: false, selected: false }));
    socket.emit("client:messageDeleted", {
      members:
        friendState.groupData && friendState.groupData.isGroup
          ? friendState.members.map((item) => item.id)
          : [friendState.id],
      userId: userState.id,
    });
    dispatch(setModalState({ open: false }));
  };

  const deleteMessagesForMe = () => {
    deleteMessagesMe({ messages, userId: userState.id });
    dispatch(selectMessage({ data: false, selected: false }));
    dispatch(setModalState({ open: false }));
  };

  const closeModal = () => {
    dispatch(setModalState({ open: false }));
  };

  useEffect(() => {
    for (const i in messages) {
      if (!messages[i].includes(userState.id) || !messages[i][2].isShown) {
        return setcanForAll(false);
      } else {
        setcanForAll(true);
      }
    }
  }, [messages]);

  return (
    <div id="modal-background" className={modalOpen ? "active" : ""}>
      <div id="modal">
        <p>
          {1 ? "Sure of deleting these messages?" : "Sure of clean the chat?"}
        </p>
        <div className={1 ? "" : "separate"}>
          <button type="button" onClick={deleteMessagesForMe}>
            For me
          </button>
          {canForAll && friendState.me && !friendState.me.leftGroupAt ? (
            <button type="button" onClick={deleteMessagesForAll}>
              For all
            </button>
          ) : null}
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
