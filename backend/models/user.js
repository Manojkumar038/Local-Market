import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },

        password: {
            type: String,
            required: function () {
                return this.providers?.local === true;
            },
        },

        phone: {
            type: String,
        },

        address: {
            city: String,
            area: String,
            landMark: String,
            district: String,
            pincode: {
                type: String,
                match: /^[0-9]{6}$/,
            },
        },

        resetToken: String,
        resetTokenExpiry: Date,

        loginToken: String,
        loginTokenExpiry: Date,

        providers: {
            local: { type: Boolean, default: false },
            google: { type: Boolean, default: false },
        },

        picture: String,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
