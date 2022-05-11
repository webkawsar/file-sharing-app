// const path = require('path');
const File = require('../models/File');

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

// eslint-disable-next-line consistent-return
exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Link has expired',
            });
        }

        res.render('download', { success: true, file });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

// eslint-disable-next-line consistent-return
exports.download = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) {
            return res.render('download', {
                success: false,
                message: 'Link has expired',
            });
        }

        // console.log(file, 'file');
        const filePath = `${__dirname}/../public/images/${file.fileName}`;
        res.download(filePath);
    } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};
