import socket from "../io";

const matchFriendRequets = (acceptFriendRequest, result) => {
  if (result.isSuccess && result.data) {
    const { resultExist, reciever, sender } = result.data;

    if (resultExist) {
      console.log("Error");
      return;
    }

    acceptFriendRequest({
      sender: sender,
      reciever: reciever,
    });
    socket.emit("client:updateFriendList", {
      userId: reciever,
      friendId: sender,
    });
    socket.emit("client:updateChat", { id: sender });
  }
};

export default matchFriendRequets;
