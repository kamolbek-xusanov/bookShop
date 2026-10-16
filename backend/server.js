require("dotenv").config()
const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

async function start() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET .env faylda topilmadi")
    }

    await connectDB()
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

start().catch((error) => {
    console.error("Serverni ishga tushirib bo'lmadi:", error.message)
    process.exit(1)
})
