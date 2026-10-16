const dns = require("dns")
const mongoose = require("mongoose")
require("dotenv").config()

dns.setServers(["8.8.8.8", "8.8.4.4"])

async function connectDB() {
    const uri = process.env.DATABASE_URL || process.env.DATABASE_NAME

    if (!uri) {
        throw new Error("DATABASE_URL .env faylda topilmadi")
    }

    await mongoose.connect(uri)
    console.log("MongoDB ulandi!")
}

module.exports = connectDB
