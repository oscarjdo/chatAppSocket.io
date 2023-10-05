const exactSize = (size) => {
  let changeSize = size;

  const fileExt = ["Bytes", "KB", "MB", "GB"];
  let i = 0;
  while (changeSize > 900) {
    changeSize /= 1024;
    i++;
  }

  return `${Math.round(changeSize * 100) / 100} ${fileExt[i]}`;
};

export default exactSize;
