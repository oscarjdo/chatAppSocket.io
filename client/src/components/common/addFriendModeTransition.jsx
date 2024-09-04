import { useSelector } from "react-redux";

function AddFriendModeTransition() {
  const addFriendModeState = useSelector((state) => state.addFriendModeState);

  return (
    <div
      id="add-friend-mode-modal"
      className={!addFriendModeState.transition ? "close" : "open"}
    >
      <h2 id="add-friend-mode-text-modal">
        {!addFriendModeState.transition ? "LET'S CHAT" : "ADD A NEW FRIEND"}
      </h2>
    </div>
  );
}

export default AddFriendModeTransition;
