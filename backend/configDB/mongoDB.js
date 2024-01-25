require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {

    
    try {
        await mongoose.connect("mongodb+srv://goyalharshika266:Harshika1411@cluster0.0yw5ulg.mongodb.net/?retryWrites=true&w=majority");
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDb;