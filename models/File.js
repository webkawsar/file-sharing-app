const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        size: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const File = mongoose.model('File', fileSchema);
module.exports = File;
