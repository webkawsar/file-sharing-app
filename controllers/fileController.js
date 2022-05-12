/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const client = require('../config/mailConfig');
const File = require('../models/File');
const emailTemplate = require('../utils/emailTemplate');

exports.upload = async (req, res) => {
    try {
        // console.log(req.file, 'file');
        const file = new File({
            fileName: req.file.filename,
            size: req.file.size,
        });
        const response = await file.save();
        res.status(201).send({
            success: true,
            link: `${process.env.APP_BASE_URL}/files/${response.id}`,
        });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

// send email to share download
exports.sendEmail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send({ success: false, message: 'Download Link has expired.' });
        }

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).send({ success: false, message: 'Download Link has expired.' });
        }

        // check email isSent
        if (file.receiver === req.body.emailTo) {
            return res.status(400).send({ success: false, message: 'Email already sent!.' });
        }

        // email config
        const emailData = {
            from: `inShare <${req.body.emailFrom}>`,
            to: [`${req.body.emailTo}`],
            subject: 'inShare file sharing download link',
            text: `${req.body.emailFrom} has shared a file with you`,
            html: emailTemplate({
                from: `${req.body.emailFrom}`,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.id}`,
                // eslint-disable-next-line radix
                size: `${parseInt(file.size / 1000)} KB`,
                expires: '24 hours',
            }),
        };
        await client.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        file.receiver = `${req.body.emailTo}`;
        file.sender = `${req.body.emailFrom}`;
        await file.save();

        res.send({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired.',
            });
        }

        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired.',
            });
        }

        res.render('download', { success: true, file });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

// download
exports.download = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired.',
            });
        }

        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired',
            });
        }

        // console.log(file, 'file');
        const filePath = `${__dirname}/../public/uploads/${file.fileName}`;
        res.download(filePath);
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};
