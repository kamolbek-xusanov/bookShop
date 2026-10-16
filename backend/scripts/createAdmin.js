// Usage: npm run create-admin -- <email> <password> [name]
// Creates a superAdmin, or promotes an existing user with that email.
require("dotenv").config()
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const User = require("../models/User")

async function main() {
    const [email, password, ism = "Admin"] = process.argv.slice(2)

    if (!email || !password) {
        console.log("Usage: npm run create-admin -- <email> <password> [name]")
        process.exit(1)
    }
    if (password.length < 6) {
        console.log("Password must be at least 6 characters")
        process.exit(1)
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })

    if (existing) {
        existing.role = "superAdmin"
        await existing.save()
        console.log(`${existing.email} is now a superAdmin (password unchanged)`)
    } else {
        await User.create({
            ism,
            email,
            password: await bcrypt.hash(password, 10),
            role: "superAdmin"
        })
        console.log(`superAdmin created: ${email}`)
    }

    await mongoose.disconnect()
}

main().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
