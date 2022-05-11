const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        size: Number,
        sender: {
            type: Boolean,
            default: undefined,
        },
        receiver: {
            type: Boolean,
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
