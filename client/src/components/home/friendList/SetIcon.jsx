import { BiCheck, BiCheckDouble, BiError } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

const SetIcon = ({ item }) => {
  if (!item.is_show) return <MdDeleteForever className="chat-icon" />;

  if (item.message_read) {
    return <BiCheckDouble className="chat-icon read" />;
  } else if (!item.message_read && item.message_recieved) {
    return <BiCheckDouble className="chat-icon" />;
  } else if (!item.message_recieved) {
    return <BiCheck className="chat-icon" />;
  }
  return <BiError className="chat-icon error">error</BiError>;
};

export default SetIcon;
