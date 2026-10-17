const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const otpController = require("../controllers/otpController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")
const { validate } = require("../middlewares/validate")
const { validateObjectId } = require("../middlewares/validateObjectId")
const { uploadImages } = require("../utils/upload")
const { createBookSchema, updateBookSchema } = require("../validators/bookValidator")
const { otpEmailSchema, otpVerifySchema } = require("../validators/userValidator")

router.get("/books", bookController.getBooks)

router.get("/books/stats", authMiddleware, roleMiddleware("admin", "superAdmin"), bookController.countBook)

router.post("/books/send", validate(otpEmailSchema), otpController.sendOtp)
router.post("/books/verify-otp", validate(otpVerifySchema), otpController.verifyOtp)

router.get("/books/:id", validateObjectId, bookController.getBookById)
router.post("/books", authMiddleware, ...uploadImages, validate(createBookSchema), bookController.createBook)
router.put("/books/:id", authMiddleware, validateObjectId, ...uploadImages, validate(updateBookSchema), bookController.editBook)
router.delete("/books/:id", authMiddleware, validateObjectId, bookController.deleteBook)

module.exports = router
