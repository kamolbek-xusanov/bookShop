const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    ism: { type: String, required: true, trim: true },
    familiya: { type: String, trim: true },
    yosh: Number,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // users who sign in with Google have no password
    password: { type: String, required: function () { return !this.googleId } },
    googleId: { type: String, unique: true, sparse: true },
    avatar: String,
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin", "menejer"],
        default: "user"
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
