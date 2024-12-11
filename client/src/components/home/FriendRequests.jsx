import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RiCloseCircleFill } from "react-icons/ri";

import { setNotiTabState } from "../../app/notiTabSlice";
import { setAmount } from "../../app/notificationsSlice";
import {
  useGetFriendRequestQuery,
  useDeleteFriendRequestMutation,
  useAcceptFrienRequestMutation,
} from "../../app/queries/friendRequestApi";

import Loader from "../common/Loader";
import socket from "../../io";

function FriendRequests() {
  const notiTabState = useSelector((state) => state.notiTabState);
  const userState = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const [deleteFriendRequest] = useDeleteFriendRequestMutation();
  const [acceptFriendRequest, { data: queryResponse }] =
    useAcceptFrienRequestMutation();

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetFriendRequestQuery(userState.id);

  const [rejected, setRejected] = useState([]);
  const [accepted, setAccepted] = useState([]);

  if (isError) console.log(error);

  useEffect(() => {
    socket.on("server:reloadFriendRequests", () => {
      setTimeout(() => {
        refetch();
      }, 500);
    });
  }, [socket]);

  useEffect(() => {
    if (data) {
      setRejected(new Array(data.length).fill(false));
      setAccepted(new Array(data.length).fill(false));
      dispatch(setAmount(data.length));
    }
  }, [data]);

  const rejectFriendRequest = (senderId, index) => {
    const rejectedItem = rejected.map((item, i) => (i == index ? true : item));

    setRejected(rejectedItem);

    setTimeout(() => {
      deleteFriendRequest({
        sender: senderId,
        reciever: userState.id,
      });
      socket.emit("client:reloadApp", {
        users: [userState.id, senderId],
      });
    }, 1100);
  };

  const confirmFriendRequest = (senderId, index) => {
    const acceptedItem = accepted.map((item, i) => (i == index ? true : item));

    setAccepted(acceptedItem);

    setTimeout(() => {
      acceptFriendRequest({
        sender: senderId,
        reciever: userState.id,
      });
      socket.emit("client:reloadApp", {
        users: [userState.id, senderId],
      });
    }, 1100);
  };

  return (
    <div
      id="notifications-background"
      className={notiTabState.active ? "active" : ""}
    >
      <ul id="notifications-ctn">
        <h2>Notifications</h2>
        {isLoading ? <Loader /> : null}
        {isSuccess ? (
          <>
            {data.length > 0 ? (
              <>
                {data.map((item, index) => {
                  return (
                    <li
                      className={`notification ${
                        rejected[index] ? `rejected` : ""
                      } ${accepted[index] ? "accepted" : ""}`}
                      key={index}
                    >
                      <div
                        className="photo"
                        style={{
                          "--p": item.img_url
                            ? `url("${item.img_url}")`
                            : "url('/profile-img.jpg')",
                        }}
                      ></div>
                      <div className="ctn">
                        <p>{item.username}</p>
                        <span>
                          #{item.request_sender_id.toString().padStart(4, "0")}
                        </span>
                        <button
                          className="accept-bttn"
                          onClick={() =>
                            confirmFriendRequest(item.request_sender_id, index)
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="reject-bttn"
                          onClick={() =>
                            rejectFriendRequest(item.request_sender_id, index)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  );
                })}
              </>
            ) : (
              <p>You don't have any notification yet.</p>
            )}
          </>
        ) : null}
      </ul>
      <RiCloseCircleFill
        id="close-noti-bttn"
        onClick={() => dispatch(setNotiTabState({ active: false }))}
      />
    </div>
  );
}

export default FriendRequests;
