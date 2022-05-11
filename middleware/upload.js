const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// multer config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename(req, file, cb) {
        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // cb(null, `${uuidv4()}-${file.originalname}`);
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});

const upload = multer({ storage }).single('share_file');

module.exports = upload;
