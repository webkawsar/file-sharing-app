const { check, validationResult } = require('express-validator');

const fileUploadValidator = [
    // check('share_file').notEmpty().withMessage('Please select file'),
    check('share_file').custom((value, { req }) => {
        const { file } = req;
        if (file) {
            if (file.size > 102400000) {
                throw new Error('File less than 100mb is allowed');
            }
            return true;
        }
        return true;
    }),
];

// eslint-disable-next-line consistent-return
const fileUploadValidationResult = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({
            success: false,
            message: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = {
    fileUploadValidator,
    fileUploadValidationResult,
};
