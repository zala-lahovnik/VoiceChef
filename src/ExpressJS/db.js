import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const connectDB = () => {
    return mongoose.connect(mongoURI)
        .then(() => {
            console.log('Connection to MongoDB is successful');
        })
        .catch((err) => {
            console.error('Connection to MongoDB failed', err);
        });
};

export default connectDB;
