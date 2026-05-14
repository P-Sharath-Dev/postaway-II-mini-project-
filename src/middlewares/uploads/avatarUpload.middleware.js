import multer from "multer";

//storage configuration
const storage = multer.diskStorage({
  //destination folder
  destination: (req, file, cb) => {
    cb(null, "public/uploads/avatars");
  },

  //uploaded filename
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//file filtering
const fileFilter = (req, file, cb) => {
  //allow only images
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("only image files are allowed"), false);
  }
};

const avatarUpload = multer({
  storage,
  fileFilter,
});

export default avatarUpload;
