const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Controller
const fileController = require('../controllers/fileController');

// multer config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename(req, file, cb) {
        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // cb(null, `${uuidv4()}-${file.originalname}`);
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});
const upload = multer({ storage }).single('share_file');

router.post('/', upload, fileController.upload);
router.get('/:id', fileController.getSingle);
router.get('/:id/download', fileController.download);
router.post('/:id/email', fileController.sendEmail);

module.exports = router;
