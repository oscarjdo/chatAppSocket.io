import { useDispatch, useSelector } from "react-redux";

import { activateInfo } from "../../../app/infoSlice.js";
import { setModalState } from "../../../app/modalSlice.js";
import { setChatSearchBarState } from "../../../app/chatSearchBarSlice.js";

function chatOptions() {
  const dispatch = useDispatch();

  const { type } = useSelector((state) => state.sideMenusState);

  return (
    <div
      id="chat-options-ctn"
      className={`options-menu ${type != "chatMenu" ? "inactive" : ""}`}
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
          <button
            onClick={() => dispatch(setChatSearchBarState({ open: true }))}
          >
            Search
          </button>
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
