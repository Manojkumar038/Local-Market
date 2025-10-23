import { connect } from 'mongoose';
const connectDB = async () => {
    try {
        // console.log(process.env.MONGO_URI)
        await connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error("Error from db.js" + err);
        process.exit(1);
    }
};
export default connectDB; 