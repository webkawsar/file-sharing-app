const { check, validationResult } = require('express-validator');

const emailValidator = [
    check('emailFrom')
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage('Your email is required')
        .isEmail()
        .withMessage('Please add valid email'),

    check('emailTo')
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage("Receiver's email is required")
        .isEmail()
        .withMessage('Please add valid email'),
];

// eslint-disable-next-line consistent-return
const emailValidationResult = (req, res, next) => {
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
    emailValidator,
    emailValidationResult,
};
