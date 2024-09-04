import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaUserAlt } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BiPlus, BiSolidLock } from "react-icons/bi";
import { GrSend } from "react-icons/gr";

import axios from "axios";
import socket from "../io";

import { setUserLoged } from "../app/userSlice";
import { setNotiState } from "../app/notiSlice";
import { setImageSelectorState } from "../app/imageSelectorSlice";

function Form() {
  const [valid, setValid] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [formType, setFormType] = useState({ type: "login", title: "Log In" });
  const [file, setFile] = useState(null);

  const { file: newFile, place } = useSelector(
    (state) => state.imageSelectorState
  );

  const dispatch = useDispatch();

  const handleChangeFormType = () => {
    const type = {
      login: { type: "login", title: "Log In" },
      signup: { type: "signup", title: "Sign Up" },
    };
    dispatch(setImageSelectorState({ file: false }));
    setUser({ username: "", email: "", password: "" });
    setValid({
      username: false,
      email: false,
      password: false,
    });

    if (formType.type == type.login.type) setFormType(type.signup);
    else setFormType(type.login);
  };

  const setNotValidField = (field) => {
    const errorMssgs = {
      username: "The username must to have between 4 and 20 characters.",
      email: "Email invalid",
      password:
        "The password must contain at least a number and one capital letter.\nThere must to be at least 8 characters.",
    };

    dispatch(
      setNotiState({ active: true, text: errorMssgs[field], type: "ERROR" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notValidField = Object.entries(valid)
      .map(([key, value]) => {
        if (formType.type == "login" && key == "username") return null;
        if (!value) return key;
        return null;
      })
      .filter((item) => item);

    if (notValidField.length >= 1) {
      return setNotValidField(notValidField[0]);
    }

    if (formType.type == "login") {
      try {
        await axios.post(
          "http://localhost:3000/logIn",
          {
            ...user,
            username: "not needed",
          },
          { withCredentials: true }
        );

        socket.connect();
        dispatch(setUserLoged());
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();

        formData.append("userData", JSON.stringify(user));

        if (file) {
          const res = await fetch(file.url);
          const data = await res.blob();
          const fileCreated = new File([data], file.name, {
            type: file.mimetype,
          });

          formData.append("image", fileCreated);
        }

        await axios.post("http://localhost:3000/signUp", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(
          setNotiState({
            active: true,
            text: "Successfully registered now login",
            type: "SUCCESS",
          })
        );

        handleChangeFormType();
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    dispatch(setImageSelectorState({ file: false, place: false }));
    setUser({ username: "", email: "", password: "" });
    setValid({
      username: false,
      email: false,
      password: false,
    });
  };

  const handleChange = (e) => {
    const regExpValidators = {
      email:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      username: /^[^\d]{4,20}$/g,
    };

    setUser({ ...user, [e.target.name]: e.target.value });

    setValid({
      ...valid,
      [e.target.name]: e.target.value.match(regExpValidators[e.target.name])
        ? true
        : false,
    });
  };

  useEffect(() => {
    if (place == "signUpForm" || !newFile) setFile(newFile);
  }, [newFile]);

  return (
    <>
      <form id="form" onSubmit={handleSubmit}>
        <div id="title-form-ctn">
          <GrSend className="form-icon" />
          <h1>{formType.title}</h1>
        </div>
        <div id="inputs-ctn">
          {formType.type == "signup" ? (
            <div className="flexCtn">
              <div
                className="photo"
                style={{
                  "--p": file
                    ? `url("${file.url}")`
                    : `url("/profile-img.jpg")`,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      setImageSelectorState({ open: true, place: "signUpForm" })
                    )
                  }
                >
                  <BiPlus className="icon" />
                </button>
              </div>

              <div className="input-ctn">
                <input
                  id="username"
                  className={`${valid.username ? "valid" : ""} input-form`}
                  name="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="off"
                  spellCheck="false"
                  value={user.username}
                  onChange={handleChange}
                />
                <label htmlFor="username">
                  <FaUserAlt className="input-icon" />
                </label>
              </div>
            </div>
          ) : null}
          <div className="input-ctn">
            <input
              id="email"
              className={`${valid.email ? "valid" : ""} input-form`}
              name="email"
              type="text"
              placeholder="Email"
              autoComplete="off"
              spellCheck="false"
              value={user.email}
              onChange={handleChange}
            />
            <label htmlFor="email">
              <MdAlternateEmail className="input-icon" />
            </label>
          </div>
          <div className="input-ctn">
            <input
              id="password"
              className={`${valid.password ? "valid" : ""} input-form`}
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              spellCheck="false"
              value={user.password}
              onChange={handleChange}
            />
            <label htmlFor="password">
              <BiSolidLock className="input-icon" />
            </label>
          </div>
        </div>
        <button type="submit" className="submitDataBttn">
          {formType.type}
        </button>
      </form>
      <div id="change-form-mode">
        <p className="link" onClick={handleChangeFormType}>
          {formType.type == "signup"
            ? "Do you have an account already?"
            : "Do you not have an account yet?"}
        </p>
        <p
          className="link"
          onClick={() =>
            dispatch(
              setNotiState({
                active: true,
                text: "This feature is not working yet",
                type: "WARNING",
              })
            )
          }
        >
          recover password
        </p>
      </div>
    </>
  );
}

export default Form;
