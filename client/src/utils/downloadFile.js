import axios from "axios";

const downloadFile = async (url, anchorRef) => {
  const response = await axios.get(url, { responseType: "blob" });
  let metadata = {
    type: response.headers.getContentType(),
  };
  const file = new File([response.data], url.split("3000/").at(-1), metadata);

  const newUrl = URL.createObjectURL(file);

  anchorRef.current.download = url.split("3000/").at(-1);
  anchorRef.current.href = newUrl;
  anchorRef.current.click();
};

export default downloadFile;
