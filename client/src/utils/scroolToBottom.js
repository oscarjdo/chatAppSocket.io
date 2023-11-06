const scrollToBottom = (down) => {
  let element = document.getElementById("chat-mssg-ctn");

  setTimeout(() => {
    const compareSize = element.scrollHeight - 700;

    if (element.scrollTop > compareSize || down || element.scrollTop == 0) {
      element.scrollTop = element.scrollHeight;
    }
  }, 100);
};

export default scrollToBottom;
