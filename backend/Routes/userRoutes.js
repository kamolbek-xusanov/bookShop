const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const otpController = require("../controllers/otpController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")
const { validate } = require("../middlewares/validate")
const { validateObjectId } = require("../middlewares/validateObjectId")
const {
    registerSchema,
    loginSchema,
    adminCreateUserSchema,
    updateUserSchema,
    googleSchema,
    otpEmailSchema,
    otpVerifySchema
} = require("../validators/userValidator")

// public
router.post("/users/register", validate(registerSchema), userController.registerUser)
router.post("/users/login", validate(loginSchema), userController.loginUser)
router.post("/users/google", validate(googleSchema), userController.googleAuth)
router.post("/users/send-otp", validate(otpEmailSchema), otpController.sendOtp)
router.post("/users/verify-otp", validate(otpVerifySchema), otpController.verifyOtp)

// logged-in users
router.get("/users/profile", authMiddleware, userController.profile)

// role based
router.get("/admin", authMiddleware, roleMiddleware("admin"), userController.admin)
router.get("/superAdmin", authMiddleware, roleMiddleware("superAdmin"), userController.superAdmin)
router.get("/menejer", authMiddleware, roleMiddleware("menejer"), userController.menejer)

// user management
router.get("/users", authMiddleware, roleMiddleware("admin", "superAdmin"), userController.getUsers)
router.post("/users", authMiddleware, roleMiddleware("superAdmin"), validate(adminCreateUserSchema), userController.createUsers)
router.put("/users/:id", authMiddleware, roleMiddleware("superAdmin"), validateObjectId, validate(updateUserSchema), userController.updateUser)
router.delete("/users/:id", authMiddleware, roleMiddleware("superAdmin"), validateObjectId, userController.deleteUser)

module.exports = router
