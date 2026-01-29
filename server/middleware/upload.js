import multer from "multer";

const upload = multer({ dest: "temp/" }); // temp storage
export default upload;
