import { IoIosArrowBack } from "react-icons/io";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectMessage } from "../../../../app/messageSelectSlice";
import { setScrollToState } from "../../../../app/scrollToSlice";
import { setChatSearchBarState } from "../../../../app/chatSearchBarSlice";

function ChatSearchBar() {
  const [mssg, setMssg] = useState("");
  const [match, setMatch] = useState([]);
  const [focusMssg, setFocusMssg] = useState({ selected: false, index: null });

  const { open } = useSelector((state) => state.chatSearchBarState);
  const { messages } = useSelector((state) => state.friendState);

  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    setFocusMssg({ selected: false, index: null });
    setMssg(e.target.value);
  };

  const handleClickUp = () => {
    if (!match.length) return;

    if (!focusMssg.selected) {
      setFocusMssg({ selected: true, index: match.length - 1 });
    } else if (focusMssg.index <= 0) {
      setFocusMssg({ selected: true, index: match.length - 1 });
    } else {
      setFocusMssg({ selected: true, index: focusMssg.index - 1 });
    }
  };

  const handleClickDown = () => {
    if (!match.length) return;

    if (!focusMssg.selected) {
      setFocusMssg({ selected: true, index: 0 });
    } else if (match.length <= focusMssg.index + 1) {
      setFocusMssg({ selected: true, index: 0 });
    } else {
      setFocusMssg({ selected: true, index: focusMssg.index + 1 });
    }
  };

  useEffect(() => {
    if (mssg.length <= 0) {
      return setMatch([]);
    }

    const allMatch = messages
      .filter(
        (item) => item.content.includes(mssg) && !item.deleted && item.is_show
      )
      .map((item) => item.message_id);

    setMatch(allMatch);
  }, [mssg]);

  useEffect(() => {
    if (focusMssg.selected) {
      dispatch(
        setScrollToState({ to: `messageId${match[focusMssg.index]}`, time: 0 })
      );
    }
  }, [focusMssg]);

  useEffect(() => {
    setMssg("");
    setMatch([]);
    setFocusMssg({ selected: false, index: null });
  }, [open]);

  return (
    <div className={`chatSearchBar ${open ? "active" : ""}`}>
      <div className="little">
        <button
          type="button"
          onClick={() => dispatch(setChatSearchBarState({ open: false }))}
        >
          <IoIosArrowBack className="icon" />
        </button>
      </div>
      <input
        type="text"
        name="searchBar"
        id="searchBar"
        placeholder="Search"
        autoComplete="off"
        value={mssg}
        onChange={handleOnChange}
      />
      <div className="chatSearchBarNav">
        <p>
          {focusMssg.selected ? focusMssg.index + 1 : 0}/{match.length}
        </p>

        <button type="button" onClick={handleClickUp}>
          <IoIosArrowBack className="icon turnUp" />
        </button>

        <button type="button" onClick={handleClickDown}>
          <IoIosArrowBack className="icon turnDown" />
        </button>
      </div>
    </div>
  );
}

export default ChatSearchBar;
