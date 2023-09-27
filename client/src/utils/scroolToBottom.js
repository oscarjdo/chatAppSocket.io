const scrollToBottom = () => {
  let element = document.getElementById("chat-mssg-ctn");

  setTimeout(() => {
    element.scrollTop = element.scrollHeight;
  }, 100);
};

export default scrollToBottom;
