const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.u2izr.mongodb.net/inShare?retryWrites=true&w=majority`
        );
        console.log('Database connected.');
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;
