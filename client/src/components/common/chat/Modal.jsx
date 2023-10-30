import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectMessage } from "../../../app/messageSelectSlice";
import { setModalState } from "../../../app/modalSlice";
import { useDeleteMessagesMutation } from "../../../app/queries/getMessages";

import socket from "../../../io";

function Modal() {
  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const { modalOpen, func, func2 } = useSelector((state) => state.modalState);
  const { messages } = useSelector((state) => state.messageSelectState);

  const dispatch = useDispatch();

  const [deleteMessages] = useDeleteMessagesMutation();

  const deleteMessagesForAll = () => {
    deleteMessages(messages);
    dispatch(selectMessage({ data: false, selected: false }));
    socket.emit("client:newMessage", {
      friendId: friendState.id,
      userId: userState.id,
    });
    dispatch(setModalState({ open: false, func: "", func2: "" }));
  };

  const funcs = {
    deleteMessagesForAll,
  };

  return (
    <div id="modal-background" className={modalOpen ? "active" : ""}>
      <div id="modal">
        <p>
          {func2
            ? "Sure of deleting these messages?"
            : "Sure of clean the chat?"}
        </p>
        <div className={func2 ? "" : "separate"}>
          {func2 ? <button type="button">For me</button> : null}
          <button type="button" onClick={funcs[func]}>
            For all
          </button>
          <button type="button">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
