import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

// const currentDir = dirname(fileURLToPath(import.meta.url));
const mimeTypes = ["image/jpeg", "image/png"];

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: "public",
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(".")[0];

      cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (mimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(null, `Only ${mimeTypes.join(" ")} mimetypes are allowed.`);
  },
  limits: {
    fileSize: 10000000,
  },
});

export default multerUpload;
