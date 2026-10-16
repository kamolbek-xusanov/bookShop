exports.notFound = (req, res) => {
    res.status(404).json({ message: `Route topilmadi: ${req.method} ${req.originalUrl}` })
}

// Express 5 forwards errors from async handlers here automatically
exports.errorHandler = (err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "JSON noto'g'ri formatda" })
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Noto'g'ri ID" })
    }
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message })
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: "Bu qiymat allaqachon mavjud" })
    }

    console.error(err)
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === "production" ? "Server xatosi" : err.message
    })
}
