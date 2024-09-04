import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Li from "./avatarMenu/Li";

import axios from "axios";

import { setAvatarMenuState } from "../app/avatarMenuSlice";

function AvatarMenu() {
  const [items, setItems] = useState([]);

  const { open, intersecting, img } = useSelector(
    (state) => state.avatarMenuState
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setAvatarMenuState({ open: false }));
  };

  useEffect(() => {
    axios
      .get("/presets/avatarPresets.json")
      .then((res) => setItems(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div id="avatarMenu" className={open ? "active" : ""}>
      <span className="background" onClick={handleClose}></span>
      <div className="ctn">
        <ul className="wrapper">
          {items.map((item, index) => (
            <Li key={index} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvatarMenu;
