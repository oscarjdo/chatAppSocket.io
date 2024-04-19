import { useDispatch } from "react-redux";

import { activateInfo } from "../../../app/infoSlice.js";
import { setModalState } from "../../../app/modalSlice.js";

import { notify } from "../../../utils/notify.js";

function chatOptions() {
  const dispatch = useDispatch();

  return (
    <>
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
    </>
  );
}

export default chatOptions;
