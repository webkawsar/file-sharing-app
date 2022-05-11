const express = require('express');

const router = express.Router();

// Controller
const fileController = require('../controllers/fileController');
// middleware
const upload = require('../middleware/upload');
const { fileUploadValidator, fileUploadValidationResult } = require('../middleware/fileValidators');
const { emailValidator, emailValidationResult } = require('../middleware/emailValidators');

// routes
router.post('/', [upload, fileUploadValidator, fileUploadValidationResult], fileController.upload);
router.get('/:id', fileController.getSingle);
router.get('/:id/download', fileController.download);
router.post('/:id/email', [emailValidator, emailValidationResult], fileController.sendEmail);

module.exports = router;
