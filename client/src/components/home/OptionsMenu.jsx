import { useDispatch, useSelector } from "react-redux";

import { setOptionsState } from "../../app/optionsSlice";

function OptionsMenu() {
  const { type } = useSelector((state) => state.sideMenusState);

  const dispatch = useDispatch();

  return (
    <div className={`options-menu ${type != "externalMenu" ? "inactive" : ""}`}>
      <ul id="config-list">
        <li>
          <button
            onClick={() =>
              dispatch(setOptionsState({ open: true, type: "info" }))
            }
          >
            Info
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              dispatch(setOptionsState({ open: true, type: "newGroup" }))
            }
          >
            New Group
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              dispatch(
                setOptionsState({ open: true, type: "featuredMessages" })
              )
            }
          >
            Featured Messages
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              dispatch(setOptionsState({ open: true, type: "settings" }))
            }
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
}

export default OptionsMenu;
