const { removeFiles } = require("../utils/upload")

// Validates req.body with a zod schema. Unknown fields are stripped,
// so users cannot sneak in fields like "role".
exports.validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        removeFiles(req.files)
        return res.status(400).json({
            message: "Validatsiya xatosi",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        })
    }

    req.body = result.data
    next()
}
