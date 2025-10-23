import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    token: String,
    createdAt: {
        type: Date,
        expires: 240, // Document expires in 4 minutes
        default: Date.now
    }
});

export default mongoose.model('PendingUser', pendingUserSchema);