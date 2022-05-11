const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/inshare');
        console.log('Database connected.');
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;
