const scrollToBottom = (down) => {
  let element = document.getElementById("chat-mssg-ctn");

  setTimeout(() => {
    const compareSize = element.scrollHeight - 700;

    if (element.scrollTop > compareSize || down || element.scrollTop == 0) {
      element.style.scrollBehavior = "auto";
      element.scrollTop = element.scrollHeight;
      element.style.scrollBehavior = "smooth";
    }
  }, 10);
};

export default scrollToBottom;
