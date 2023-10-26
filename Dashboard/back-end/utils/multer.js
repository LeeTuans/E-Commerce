import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("File is not supported !!!"), false);
    }
  },
});

export default upload;
