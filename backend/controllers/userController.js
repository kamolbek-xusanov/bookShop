const bcrypt = require("bcrypt")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const { OAuth2Client } = require("google-auth-library")

exports.getUsers = async (req, res) => {
    const users = await User.find().select("-password")
    res.status(200).json(users)
}

exports.registerUser = async (req, res) => {
    const { ism, familiya, yosh, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "Oldin royxatdan o'tgansiz!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ ism, familiya, yosh, email, password: hashedPassword })

    res.status(201).json({ message: "User qo'shildi!" })
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    const isMatch = user?.password ? await bcrypt.compare(password, user.password) : false

    if (!isMatch) {
        return res.status(401).json({ message: "Email yoki parol noto'g'ri!" })
    }

    res.status(200).json({
        message: "Login successful",
        token: generateToken(user),
        user: { id: user._id, ism: user.ism, familiya: user.familiya, email: user.email, role: user.role }
    })
}

const publicUser = (user) => ({ id: user._id, ism: user.ism, familiya: user.familiya, email: user.email, role: user.role, avatar: user.avatar })

exports.googleAuth = async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
        return res.status(503).json({ message: "Google bilan kirish sozlanmagan" })
    }

    let payload
    try {
        const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: req.body.credential, audience: clientId })
        payload = ticket.getPayload()
    } catch {
        return res.status(401).json({ message: "Google tokeni yaroqsiz" })
    }

    if (!payload?.email || !payload.email_verified) {
        return res.status(401).json({ message: "Google email tasdiqlanmagan" })
    }

    const email = payload.email.toLowerCase()
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] })
    let isNew = false

    if (!user) {
        user = await User.create({
            ism: payload.given_name || payload.name || email.split("@")[0],
            familiya: payload.family_name,
            email,
            googleId: payload.sub,
            avatar: payload.picture
        })
        isNew = true
    } else if (!user.googleId) {
        user.googleId = payload.sub
        if (!user.avatar) user.avatar = payload.picture
        await user.save()
    }

    res.status(isNew ? 201 : 200).json({
        message: isNew ? "Ro'yxatdan o'tdingiz" : "Login successful",
        isNew,
        token: generateToken(user),
        user: publicUser(user)
    })
}

exports.profile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
        return res.status(404).json({ message: "User topilmadi" })
    }

    res.status(200).json({ message: "Protected profile", user })
}

exports.admin = (req, res) => {
    res.status(200).json({ message: "Admin profil", user: req.user })
}

exports.superAdmin = (req, res) => {
    res.status(200).json({ message: "Super admin profil", user: req.user })
}

exports.menejer = (req, res) => {
    res.status(200).json({ message: "Menejer profil", user: req.user })
}

exports.createUsers = async (req, res) => {
    const { password, ...otherData } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({ ...otherData, password: hashedPassword })

    res.status(201).json({ message: "User qo'shildi!" })
}

exports.updateUser = async (req, res) => {
    const data = { ...req.body }

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true }).select("-password")

    if (!user) {
        return res.status(404).json({ message: "User topilmadi" })
    }

    res.status(200).json(user)
}

exports.deleteUser = async (req, res) => {
    if (req.params.id === req.user.id) {
        return res.status(400).json({ message: "O'zingizni o'chira olmaysiz" })
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return res.status(404).json({ message: "User topilmadi" })
    }

    res.status(200).json({ message: "User o'chirildi" })
}
