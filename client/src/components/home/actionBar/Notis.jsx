import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MdNotifications, MdNotificationsActive } from "react-icons/md";

import { setNotiTabState } from "../../../app/notiTabSlice.js";

function Notis() {
  const [newNoti, setNewNoti] = useState(false);

  const notificationsState = useSelector((state) => state.notificationsState);

  const dispatch = useDispatch();

  const handleClickNoti = () => {
    dispatch(setNotiTabState({ active: true }));
  };

  useEffect(() => {
    setNewNoti(true);
    setTimeout(() => {
      setNewNoti(false);
    }, 1000);
  }, [notificationsState]);

  return (
    <div id="notifications-icon-ctn">
      {notificationsState.amount > 0 ? (
        <span id="notifications-amount" onClick={handleClickNoti}>
          {notificationsState.amount < 100 ? notificationsState.amount : "99+"}
        </span>
      ) : null}
      {!newNoti ? (
        <MdNotifications
          className="friend-requests-icon"
          onClick={handleClickNoti}
        />
      ) : (
        <MdNotificationsActive
          className="friend-requests-icon active"
          onClick={handleClickNoti}
        />
      )}
    </div>
  );
}

export default Notis;
