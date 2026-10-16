const mongoose = require("mongoose")

exports.validateObjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Noto'g'ri ID" })
    }
    next()
}
