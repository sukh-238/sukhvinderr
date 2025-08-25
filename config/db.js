import mongoose from 'mongoose';


const connectDB = async () => {
const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI missing');
await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MongoDB connected');
};


export default connectDB;