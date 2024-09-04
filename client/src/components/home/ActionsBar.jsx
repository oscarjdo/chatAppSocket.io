import { useDispatch, useSelector } from "react-redux";

import { RiCloseCircleFill } from "react-icons/ri";
import { PiUserCirclePlusBold } from "react-icons/pi";

import { setAddFriendMode } from "../../app/addFriendModeSlice.js";

import Notis from "./actionBar/Notis.jsx";
import OptionsBttn from "./actionBar/OptionsBttn.jsx";

function ActionsBar() {
  const addFriendModeState = useSelector((state) => state.addFriendModeState);

  const dispatch = useDispatch();

  const handleChangeMode = (mode) => {
    dispatch(setAddFriendMode({ ...addFriendModeState, transition: mode }));
    setTimeout(() => {
      dispatch(setAddFriendMode({ open: mode, transition: mode }));
    }, 705);
  };

  return (
    <div id="search-bar-ctn">
      {!addFriendModeState.open ? (
        <>
          <PiUserCirclePlusBold
            className="add-friend-mode-icon"
            onClick={() => handleChangeMode(true)}
          />
          <Notis />
          <OptionsBttn />
        </>
      ) : (
        <RiCloseCircleFill
          className="add-friend-mode-icon"
          onClick={() => handleChangeMode(false)}
        />
      )}
    </div>
  );
}

export default ActionsBar;
