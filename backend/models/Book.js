const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    nomi: { type: String, required: true, trim: true },
    sahifasi: Number,
    muallifi: { type: String, required: true, trim: true },
    Janr: String,
    tavsif: { type: String, trim: true },
    tili: { type: String, trim: true },
    nashrYili: Number,
    narxi: { type: Number, min: 0 },
    sotuvdaBor: { type: Boolean, default: true },
    images: { type: [String], default: [], validate: [(list) => list.length <= 5, "Ko'pi bilan 5 ta rasm"] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

module.exports = mongoose.model("Book", bookSchema)
