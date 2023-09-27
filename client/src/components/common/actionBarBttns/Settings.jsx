import { RiSettings4Fill } from "react-icons/ri";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { openUserInfo } from "../../../app/userInfoSlice";

import { notify } from "../../../utils/notify";

function Settings() {
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
            <button onClick={() => dispatch(openUserInfo(true))}>Info</button>
          </li>
          <li>
            <button onClick={notify}>New Group</button>
          </li>
          <li>
            <button onClick={notify}>Settings</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
