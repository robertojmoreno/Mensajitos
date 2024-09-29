const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limita el tamaño del archivo a 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Archivo no soportado. Sube solo imágenes o videos."));
  }
}).single('media'); // 'media' es el nombre del campo en el formulario

module.exports = upload;
