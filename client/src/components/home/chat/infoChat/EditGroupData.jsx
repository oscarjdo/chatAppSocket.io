import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";

import { setEditGroupDataState } from "../../../../app/editGroupDataSlice";

import socket from "../../../../io";

import axios from "axios";

function EditGroupData() {
  const [text, setText] = useState("");

  const { open, type } = useSelector((state) => state.editGroupDataState);
  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const data = {
        conversationId: friendState.conversationId,
        updater: userState.username,
        type,
        text,
      };

      await axios.put("http://localhost:3000/updateGroupData", data);

      const keys = Object.keys(friendsOnlineState.list).map((item) =>
        parseInt(item)
      );

      socket.emit("client:reloadApp", { users: [keys, userState.id].flat() });

      dispatch(setEditGroupDataState({ open: false, type: null }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (open) setText(friendState.groupData[`group_${type}`]);
  }, [open]);

  return (
    <form
      id="edit-group-data-form"
      className={open ? "active" : ""}
      onSubmit={handleSubmit}
    >
      <IoIosArrowBack
        id="close-edit-group-data"
        onClick={() => {
          dispatch(setEditGroupDataState({ open: false, type: null }));
        }}
      />
      <h4>Set group {type}</h4>
      <div>
        {type == "name" ? (
          <>
            <span style={{ color: text.length == 25 ? "red" : "white" }}>
              {text.length}/25
            </span>
            <input
              type="text"
              name="editGroupDataInput"
              id="editGroupDataInput"
              spellCheck="false"
              maxLength={25}
              value={text}
              onChange={handleChange}
            />
          </>
        ) : null}

        {type == "description" ? (
          <>
            <span style={{ color: text.length == 255 ? "red" : "white" }}>
              {text.length}/255
            </span>
            <textarea
              name="editGroupDataInput"
              id="editGroupDataInput"
              spellCheck="false"
              maxLength={255}
              value={text}
              onChange={handleChange}
            ></textarea>
          </>
        ) : null}
      </div>
      <button id="edit-group-data" type="submit">
        <MdOutlineDone className="icon" />
      </button>
    </form>
  );
}

export default EditGroupData;
