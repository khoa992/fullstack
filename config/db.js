const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error("Problem connecting to MongoDB");
        process.exit(1);
    }
}

module.exports = connectDB;