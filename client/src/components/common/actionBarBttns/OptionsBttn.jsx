import React from "react";
import { useDispatch } from "react-redux";

import { setSideMenusState } from "../../../app/sideMenusSlice";

import { RiSettings4Fill } from "react-icons/ri";

function OptionsBttn() {
  const dispatch = useDispatch();

  return (
    <>
      <RiSettings4Fill
        id="config-icon"
        onClick={() => dispatch(setSideMenusState({ type: "externalMenu" }))}
      />
    </>
  );
}

export default OptionsBttn;
