import React from "react";
import { useDispatch } from "react-redux";

import { RiSettings4Fill } from "react-icons/ri";

import { setSideMenusState } from "../../../app/sideMenusSlice";

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
