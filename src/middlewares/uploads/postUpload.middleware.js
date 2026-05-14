import multer from "multer";

//storage config
const storage = multer.diskStorage({
  //destination folder
  destination: (req, file, cb) => {
    cb(null, "public/uploads/posts");
  },
  //uploaded filename
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//file filter
const fileFilter = (req, file, cb) => {
  //allow images and videos
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("only image and video files are allowed"), false);
  }
};

const postUpload = multer({
  storage,
  fileFilter,
});

export default postUpload;
