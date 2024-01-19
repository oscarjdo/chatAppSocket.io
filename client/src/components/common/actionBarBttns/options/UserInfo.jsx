import { IoIosArrowBack } from "react-icons/io";
import { MdPhotoLibrary } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setOptionsState } from "../../../../app/optionsSlice";
import { logout } from "../../../../app/actions/actions";

import axios from "axios";
import socket from "../../../../io";

function UserInfo() {
  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    await axios.delete("http://localhost:3000/logOut", {
      withCredentials: true,
    });
    navigate("/login");
    dispatch(logout());
    socket.disconnect();
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("userId", userState.id);
    formData.append("image", file);

    try {
      if (userState.imgUrl) {
        await axios.delete(
          `http://localhost:3000/deleteImgFromServer/${userState.id}`
        );
      }

      await axios.put("http://localhost:3000/changePhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    } catch (error) {
      return console.log(error);
    }

    const keys = Object.keys(friendsOnlineState.list).map((item) =>
      parseInt(item)
    );

    socket.emit("client:photoChanged", { keys, userId: userState.id });
  };

  return (
    <>
      <IoIosArrowBack
        id="back-user-info-bttn"
        onClick={() => dispatch(setOptionsState({ open: false }))}
      />
      <div id="user-photo-ctn">
        <div
          className="photo"
          style={{
            "--p": userState.imgUrl
              ? `url("${userState.imgUrl}")`
              : "url('/profile-img.jpg')",
          }}
        ></div>
        <input
          type="file"
          name="input-file"
          id="input-file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleImage}
        />
        <label htmlFor="input-file" id="change-photo-bttn">
          <MdPhotoLibrary id="change-photo-icon" />
        </label>
      </div>
      <div id="user-info-text">
        <h1>{userState.username}</h1>
        <p>{"#" + userState.id.toString().padStart(4, "0000")}</p>
        <p>{userState.email}</p>
      </div>

      <button type="button" className="log-out-bttn" onClick={handleLogOut}>
        <RiLogoutCircleRLine className="icon" />
        Log out
      </button>
    </>
  );
}

export default UserInfo;
