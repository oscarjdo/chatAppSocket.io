import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { BsFillImageFill } from "react-icons/bs";
import { IoCamera, IoClose } from "react-icons/io5";
import { FaFaceGrinBeam } from "react-icons/fa6";

import { setImageSelectorState } from "../app/imageSelectorSlice";
import { setCameraState } from "../app/cameraSlice";
import { setAvatarMenuState } from "../app/avatarMenuSlice";

function GalleryOrCamera() {
  const { open, file } = useSelector((state) => state.imageSelectorState);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setImageSelectorState({ open: false }));

  const handleMultimediaChange = (e) => {
    const fileEntered = e.target.files[0];

    const name = fileEntered.name;
    const mimetype = fileEntered.type;
    const url = URL.createObjectURL(fileEntered);

    dispatch(
      setImageSelectorState({ open: false, file: { url, name, mimetype } })
    );

    e.target.value = null;
  };

  const handleOpenCamera = () => {
    dispatch(setCameraState({ open: true, to: "galleryOrCamera" }));

    handleClose();
  };

  const handleopenAvatarMenu = () => {
    dispatch(setAvatarMenuState({ open: true }));

    handleClose();
  };

  const handleRemoveImg = () => {
    dispatch(setImageSelectorState({ file: false, open: false, place: false }));
  };

  return (
    <div id="galleryOrCameraCtn" className={open ? "active" : ""}>
      <span className="background" onClick={handleClose}></span>
      <div className="ctn">
        <input
          type="file"
          className="file-chat"
          name="galleryImage"
          id="galleryImage"
          accept="image/*"
          onChange={handleMultimediaChange}
        />

        <button type="button" className="midColorBttn one">
          <label htmlFor="galleryImage" onClick={handleClose}>
            <BsFillImageFill className="icon" />
          </label>
        </button>

        <button
          type="button"
          className="midColorBttn two bigger"
          onClick={handleOpenCamera}
        >
          <IoCamera className="icon" />
        </button>

        <button
          type="button"
          className="midColorBttn three"
          onClick={handleopenAvatarMenu}
        >
          <FaFaceGrinBeam className="icon" />
        </button>

        {file ? (
          <button
            type="button"
            className="midColorBttn bigger"
            onClick={handleRemoveImg}
          >
            <IoClose className="icon" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default GalleryOrCamera;
