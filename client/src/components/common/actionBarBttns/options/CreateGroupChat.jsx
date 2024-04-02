import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import { useGetFriendListQuery } from "../../../../app/queries/getFriendList";
import { setOptionsState } from "../../../../app/optionsSlice";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import socket from "../../../../io";

function CreateGroupChat() {
  const [img, setImg] = useState({ img: null, url: null });
  const [memberList, setMemberList] = useState([]);
  const [memberSelected, setMemberSelected] = useState(false);
  const [menuChanged, setMenuChanged] = useState(false);
  const [groupData, setGroupData] = useState({ name: "", description: "" });

  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();

  const { data, error, isError, isLoading, isSuccess } = useGetFriendListQuery(
    `/getFriendList/${userState.id}`
  );

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImg({ img: file, url });
  };

  const handleCloseMember = (id) => {
    setMemberList(
      memberList.map((it) => (it.id !== id ? it : { ...it, go: true }))
    );

    setTimeout(() => {
      return setMemberList(
        memberList
          .filter((it) => it.id !== id)
          .map((it) => {
            return { ...it, in: false };
          })
      );
    }, 200);
  };

  const handleClick = (item) => {
    const exists = memberList
      .map((it) => (it.id == item.members.userId ? item.members.userId : false))
      .filter((it) => it)[0];

    if (exists) handleCloseMember(exists);
    else {
      setMemberList([
        ...memberList,
        {
          id: item.members.userId,
          username: item.members.username,
          photo: item.members.imgUrl,
          in: true,
        },
      ]);
    }
  };

  const handleMemberSelected = () => {
    setMemberSelected(true);

    setTimeout(() => setMenuChanged(true), 1000);
  };

  const handleChange = (e) => {
    const ev = e.target;

    setGroupData({ ...groupData, [ev.name]: ev.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      members: memberList.map((it) => it.id),
      info: groupData,
      groupCreator: userState.id,
    };

    const formData = new FormData();

    if (img.img) formData.append("img", img.img);
    formData.append("data", JSON.stringify(data));

    try {
      const response = await axios.post(
        "http://localhost:3000/createGroup",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) dispatch(setOptionsState({ open: false }));

      const keys = Object.keys(friendsOnlineState.list).map((item) =>
        parseInt(item)
      );

      socket.emit("client:groupPhotoChanged", { keys, userId: userState.id });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isError) console.log(error);
  }, [data]);

  useEffect(() => {
    if (memberSelected)
      setMemberList(
        memberList.sort((a, b) =>
          a.username.toUpperCase().localeCompare(b.username.toUpperCase())
        )
      );
  }, [memberSelected]);

  return (
    <>
      <div id="new-group-nav">
        <IoIosArrowBack
          className="icon"
          onClick={() => dispatch(setOptionsState({ open: false }))}
        />
        <h3>New group</h3>
      </div>

      <form id="create-new-group-form" onSubmit={handleSubmit}>
        <div id="group-photo-ctn">
          <label htmlFor="input-file">
            <div
              className="photo"
              style={{
                "--p": img.url
                  ? `url("${img.url}")`
                  : "url('/group-photo.jpg')",
              }}
            ></div>
          </label>

          <input
            type="file"
            name="input-file"
            id="input-file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleImage}
          />

          <div className="data-input">
            <input
              id="group-name-input"
              type="text"
              placeholder=""
              maxLength={25}
              name="name"
              autoComplete="off"
              value={groupData.name}
              onChange={handleChange}
            />
            <label htmlFor="group-name-input">Group name</label>
          </div>
        </div>

        <div className="data-input">
          <input
            id="group-description-input"
            type="text"
            placeholder=""
            maxLength={255}
            name="description"
            autoComplete="off"
            value={groupData.description}
            onChange={handleChange}
          />
          <label htmlFor="group-description-input">Group description</label>
        </div>

        <div
          id="members"
          className={`${memberSelected ? "active" : ""} 
          ${menuChanged ? "changed" : ""}
          `}
        >
          <div className={`member-count ${memberSelected ? "active" : ""}`}>
            <p>Members</p>
            <p>{memberList.length}</p>
          </div>
          <ul
            className={`member-list ${memberList.length > 0 ? "active" : ""} ${
              menuChanged ? "changed" : ""
            }`}
          >
            {memberList.length > 0
              ? memberList.map((it, index) => (
                  <li
                    key={index}
                    className={`${it.in ? "in" : ""} ${it.go ? "go" : ""}`}
                  >
                    <div
                      className="photo"
                      style={{
                        "--p": it.photo
                          ? `url("${it.photo}")`
                          : "url('/profile-img.jpg')",
                      }}
                    ></div>

                    <p>{it.username.split(" ")[0]}</p>

                    {!menuChanged ? (
                      <button
                        type="button"
                        onClick={() => handleCloseMember(it.id)}
                      >
                        <IoClose className="icon" />
                      </button>
                    ) : null}
                  </li>
                ))
              : null}
          </ul>

          {!menuChanged ? (
            <ul
              className={`friend-list-to-add ${
                memberList.length > 0 ? "active" : ""
              }`}
            >
              {isLoading ? <p>Is loading...</p> : null}
              {data && isSuccess
                ? data
                    .slice()
                    .sort((a, b) =>
                      !a.isGroup && !b.isGroup
                        ? a.members.username
                            .toUpperCase()
                            .localeCompare(b.members.username.toUpperCase())
                        : null
                    )
                    .map((item, index) => {
                      const selected = memberList.map((it) =>
                        it.id == item.members.userId ? true : false
                      );

                      if (item.isGroup) return null;

                      return (
                        <li key={index} onClick={() => handleClick(item)}>
                          <div
                            className="photo"
                            style={{
                              "--p": item.members.imgUrl
                                ? `url("${item.members.imgUrl}")`
                                : "url('/profile-img.jpg')",
                            }}
                          ></div>

                          <div className="data">
                            <p>{item.members.username}</p>
                            <p>User ID: {item.members.userId}</p>
                          </div>

                          <span
                            className={selected.includes(true) ? "active" : ""}
                          ></span>
                        </li>
                      );
                    })
                : null}
            </ul>
          ) : null}

          <button
            type="button"
            className={memberList.length && !memberSelected > 0 ? "active" : ""}
            onClick={handleMemberSelected}
          >
            <IoIosArrowBack className="icon" />
          </button>
        </div>

        <button
          type="submit"
          className={groupData.name && groupData.description ? "active" : ""}
        >
          Create group
        </button>
      </form>
    </>
  );
}

export default CreateGroupChat;
