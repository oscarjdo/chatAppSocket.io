import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useInViewPort from "../../hooks/useInViewPort";

import {
  setAvatarMenuState,
  setIntersectedAvatar,
} from "../../app/avatarMenuSlice";
import { setImageSelectorState } from "../../app/imageSelectorSlice";

function Li({ item }) {
  const targetRef = useRef(null);

  const inViewport = useInViewPort(targetRef, {
    rootMargin: "-50%",
  });

  const [selected, setSelected] = useState(false);

  const { intersecting, img } = useSelector((state) => state.avatarMenuState);

  const dispatch = useDispatch();

  const handleClick = (e) => {
    if (inViewport && !intersecting) {
      setSelected(true);

      dispatch(setIntersectedAvatar({ intersected: true, img: item }));
    }

    if (intersecting && selected) {
      dispatch(
        setImageSelectorState({
          file: { url: img, name: "Avatar", mimetype: "image/jpg" },
        })
      );

      setSelected(false);
      dispatch(setIntersectedAvatar({}));
      dispatch(setAvatarMenuState({}));
    }

    if (!intersecting && !inViewport)
      e.target.scrollIntoView({
        block: "center",
        inline: "center",
      });
    if (intersecting && !inViewport) {
      setSelected(false);
      dispatch(setIntersectedAvatar({}));
    }
  };

  useEffect(() => {
    if (!inViewport) {
      setSelected(false);
      dispatch(setIntersectedAvatar({}));
    }
  }, [inViewport]);

  useEffect(() => {
    if (!intersecting) {
      setSelected(false);
    }
  }, [intersecting]);

  return (
    <li ref={targetRef} className={selected ? "selected" : ""}>
      <div
        className="photo"
        style={{ "--p": `url("${item}")` }}
        onClick={handleClick}
      ></div>
    </li>
  );
}

export default Li;
