const transporter = require("../config/mail")
const otpService = require("../utils/otp")

exports.sendOtp = async (req, res) => {
    const { email } = req.body
    const otp = otpService.create(email)

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Tasdiqlash kodi",
            text: `Sizning tasdiqlash kodingiz: ${otp}. Kod 5 daqiqa amal qiladi.`
        })
    } catch (error) {
        otpService.remove(email)
        throw error
    }

    res.status(200).json({ message: "OTP jo'natildi" })
}

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body
    const result = otpService.verify(email, otp)

    if (!result.ok) {
        return res.status(400).json({ message: result.message })
    }

    res.status(200).json({ message: "OTP verified" })
}
