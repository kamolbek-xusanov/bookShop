// Usage: roleMiddleware("admin") or roleMiddleware("admin", "superAdmin")
exports.roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Login qilish shart" })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Kirish man etiladi" })
        }

        next()
    }
}
