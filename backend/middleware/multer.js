import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Adjust storage location and filename configuration as needed
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     req.body.file = file
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


export default upload
