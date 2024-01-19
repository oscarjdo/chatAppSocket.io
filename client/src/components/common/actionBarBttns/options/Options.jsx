import { useSelector } from "react-redux";

import UserInfo from "./UserInfo";
import CreateGroupChat from "./CreateGroupChat";

function Options() {
  const { open, type } = useSelector((state) => state.optionsState);

  const setType = () => {
    if (type === "info") return <UserInfo />;
    if (type === "newGroup") return <CreateGroupChat />;
    if (type === "settings") return <UserInfo />;
  };

  return (
    <div id="options-ctn" className={open ? "active" : ""}>
      {setType()}
    </div>
  );
}

export default Options;
