import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotiState } from "../app/notiSlice";

import {
  PiCheckCircleFill,
  PiInfoFill,
  PiWarningCircleFill,
} from "react-icons/pi";
import { MdOutlineWarning } from "react-icons/md";

function Noti() {
  const { active, text, type, waitText, waitType } = useSelector(
    (state) => state.notiState
  );

  const dispatch = useDispatch();

  const timer = useRef();

  const colors = {
    ERROR: "#ff0000",
    INFO: "#0051ff",
    SUCCESS: "#32d400",
    WARNING: "#e2ad00",
  };

  const setIcons = () => {
    return (
      <>
        <PiWarningCircleFill
          className="icon"
          style={{
            "--iC": colors[type] || "white",
            opacity: type == "ERROR" ? 1 : 0,
          }}
        />
        <PiWarningCircleFill
          className="icon blur"
          style={{ "--iC": "black", opacity: type == "ERROR" ? 1 : 0 }}
        />

        <PiInfoFill
          className="icon"
          style={{
            "--iC": colors[type] || "white",
            opacity: type == "INFO" ? 1 : 0,
          }}
        />
        <PiInfoFill
          className="icon blur"
          style={{ "--iC": "black", opacity: type == "INFO" ? 1 : 0 }}
        />

        <PiCheckCircleFill
          className="icon"
          style={{
            "--iC": colors[type] || "white",
            opacity: type == "SUCCESS" ? 1 : 0,
          }}
        />
        <PiCheckCircleFill
          className="icon blur"
          style={{ "--iC": "black", opacity: type == "SUCCESS" ? 1 : 0 }}
        />

        <MdOutlineWarning
          className="icon"
          style={{
            "--iC": colors[type] || "white",
            opacity: type == "WARNING" ? 1 : 0,
          }}
        />
        <MdOutlineWarning
          className="icon blur"
          style={{ "--iC": "black", opacity: type == "WARNING" ? 1 : 0 }}
        />
      </>
    );
  };

  const closeNoti = (time) => {
    timer.current = setTimeout(() => {
      dispatch(setNotiState({ close: true }));

      setTimeout(() => dispatch(setNotiState({})), 1200);
    }, time);
  };

  useEffect(() => {
    if (active) closeNoti(5000);
    else if (!active && waitText) {
      clearTimeout(timer.current);

      setTimeout(() => {
        dispatch(
          setNotiState({ text: waitText, type: waitType, changed: true })
        );
      }, 1200);
    }
  }, [active]);

  return (
    <div
      id="notiCtn"
      className={active ? "active" : ""}
      style={{ "--mC": colors[type] || "white" }}
      onClick={() => {
        clearTimeout(timer.current);

        closeNoti(0);
      }}
    >
      <span></span>
      <div>
        <p>{text}</p>
      </div>

      {setIcons()}
    </div>
  );
}

export default Noti;
