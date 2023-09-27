import { useDispatch } from "react-redux";

import { notify } from "../../../utils/notify.js";
import { activateInfo } from "../../../app/infoSlice.js";

function chatOptions() {
  const dispatch = useDispatch();

  return (
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
        <button onClick={notify}>Clear chat</button>
      </li>
    </ul>
  );
}

export default chatOptions;
