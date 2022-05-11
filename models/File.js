const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        size: Number,
        sender: {
            type: String,
            default: undefined,
        },
        receiver: {
            type: String,
            default: undefined,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const File = mongoose.model('File', fileSchema);
module.exports = File;
