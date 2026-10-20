const mongoose = require("mongoose")
 
// Rasmlar to'g'ridan-to'g'ri MongoDB'da saqlanadi (lokal va Render bir xil bazani ko'radi)
const imageSchema = new mongoose.Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
}, { timestamps: true })
 
module.exports = mongoose.model("Image", imageSchema)
 