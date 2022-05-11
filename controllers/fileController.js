/* eslint-disable consistent-return */
// const path = require('path');
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

exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired',
            });
        }

        res.render('download', { success: true, file });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

exports.download = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired',
            });
        }

        // console.log(file, 'file');
        const filePath = `${__dirname}/../public/images/${file.fileName}`;
        res.download(filePath);
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

exports.sendEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Download Link has expired',
            });
        }

        console.log(req.body, 'body');

        // email config
        const emailData = {
            from: `${req.body.emailFrom}`,
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
        res.send({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};
