import multer from "multer";

const multerUpload = multer({
    dest: "temp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only images allowed"));
        }
        cb(null, true);
    },
});
// temp storage

export default multerUpload;
