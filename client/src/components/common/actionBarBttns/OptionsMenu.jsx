import { RiSettings4Fill } from "react-icons/ri";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { setOptionsState } from "../../../app/optionsSlice";

function OptionsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const handleClick = () => {
    setMenuOpen(true);
    document.body.addEventListener("pointerdown", function handleEvent(e) {
      setMenuOpen(false);
      document.body.removeEventListener("pointerdown", handleEvent);
    });
    document.body.addEventListener("touchstart", function handleEvent(e) {
      setMenuOpen(false);
      document.body.removeEventListener("touchstart", handleEvent);
    });
  };

  return (
    <div id="config-ctn">
      <RiSettings4Fill id="config-icon" onClick={handleClick} />
      <div className={`settings-menu ${!menuOpen ? "inactive" : ""}`}>
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
                dispatch(setOptionsState({ open: true, type: "settings" }))
              }
            >
              Settings
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default OptionsMenu;
