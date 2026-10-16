const jwt = require("jsonwebtoken")

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token required" })
    }

    const token = authHeader.split(" ")[1]

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token yaroqsiz yoki muddati tugagan" })
    }
}
