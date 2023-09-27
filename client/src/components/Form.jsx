import { FaUserAlt } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BiSolidLock } from "react-icons/bi";
import { GrSend } from "react-icons/gr";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { notify } from "../utils/notify";

import { useSelector } from "react-redux";

import socket from "../io";

function Form() {
  const userState = useSelector((state) => state.userState);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [iconActive, setIconActive] = useState(false);

  const [user, setUser] = useState({ username: "", email: "", password: "" });

  const handleIcon = () => {
    setIconActive(true);

    setTimeout(() => {
      setIconActive(false);
    }, 1000 * 2);
  };

  const handleNavigate = () => {
    setIconActive(true);
    setTimeout(() => {
      navigate(pathname == "/login" ? "/signup" : "/login");
    }, 1000 * 2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectError = (data) => {
      data.map((item) => {
        let mssg;
        switch (item.path) {
          case "username":
            mssg = "Username must be longer than 3 characters.";

            break;

          case "email":
            mssg = "The email is not a valid email.";
            break;

          case "password":
            mssg = "Password must contain more than 4 characters.";
            break;

          default:
            mssg = "Error unknown.";
            break;
        }
        notify({ type: "error", mssg });
      });
    };

    if (pathname == "/login") {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/logIn",
          {
            ...user,
            username: "not needed",
          },
          { withCredentials: true }
        );

        if (typeof data == "object") {
          selectError(data);
        } else {
          socket.connect();
          return navigate("/");
        }
      } catch (error) {
        const errorToNotify = error.response.data.message;
        if (errorToNotify) notify({ type: "error", mssg: errorToNotify });
      }
    } else {
      const { data } = await axios.post("http://localhost:3000/signUp", user);

      if (data !== "Created") {
        selectError(data);
      } else {
        navigate("/login");
      }
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (userState.id) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <motion.div
      transition={{ duration: 0.4 }}
      initial={{
        // translateX: "-100%",
        opacity: 0,
        position: "absolute",
      }}
      animate={{
        // translateX: 0,
        opacity: 1,
        position: "relative",
      }}
      exit={{
        // translateX: "100%",
        opacity: 0,
        position: "absolute",
      }}
    >
      <form id="form" onSubmit={handleSubmit}>
        <div id="title-form-ctn" onClick={iconActive ? null : handleIcon}>
          <GrSend className={iconActive ? "form-icon active" : "form-icon"} />
          <h1>{pathname == "/signup" ? "Sing Up" : "Log In"}</h1>
        </div>
        <div id="inputs-ctn">
          {pathname == "/signup" ? (
            <div className="input-ctn">
              <input
                id="username"
                className="input-form"
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="off"
                required
                spellCheck="false"
                onChange={handleChange}
              />
              <label htmlFor="username">
                <FaUserAlt className="input-icon" />
              </label>
            </div>
          ) : null}
          <div className="input-ctn">
            <input
              id="email"
              className="input-form"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="off"
              required
              spellCheck="false"
              onChange={handleChange}
            />
            <label htmlFor="email">
              <MdAlternateEmail className="input-icon" />
            </label>
          </div>
          <div className="input-ctn">
            <input
              id="password"
              className="input-form"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
              spellCheck="false"
              onChange={handleChange}
            />
            <label htmlFor="password">
              <BiSolidLock className="input-icon" />
            </label>
          </div>
        </div>
        <button type="submit">{pathname.replace("/", "")}</button>
      </form>
      <div id="change-form-mode">
        <p className="link" onClick={() => handleNavigate()}>
          {pathname == "/signup"
            ? "Do you have an account already?"
            : "Do you not have an account yet?"}
        </p>
        <p className="link">recover password</p>
      </div>
    </motion.div>
  );
}

export default Form;
