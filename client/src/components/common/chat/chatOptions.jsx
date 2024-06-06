import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { activateInfo } from "../../../app/infoSlice.js";
import { setModalState } from "../../../app/modalSlice.js";

import { notify } from "../../../utils/notify.js";

function chatOptions() {
  const dispatch = useDispatch();

  const { type } = useSelector((state) => state.sideMenusState);

  return (
    <div
      id="chat-options-ctn"
      className={`chat-options ${type != "chatMenu" ? "inactive" : ""}`}
    >
      <ul>
        <li>
          <button
            onClick={() => {
              dispatch(activateInfo(true));
            }}
          >
            Info
          </button>
        </li>
        <li>
          <button onClick={notify}>Search</button>
        </li>
        <li>
          <button
            onClick={() =>
              dispatch(setModalState({ open: true, type: "clearChat" }))
            }
          >
            Clear chat
          </button>
        </li>
      </ul>
    </div>
  );
}

export default chatOptions;
