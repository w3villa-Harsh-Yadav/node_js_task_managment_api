const mongoose = require('mongoose')

const connectDb = async(url) => {
    await mongoose.connect(url,console.log('Connected to database'));
}

module.exports = connectDb;
