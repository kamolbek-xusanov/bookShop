require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bookRoutes = require("./Routes/bookRoutes")
const userRoutes = require("./Routes/userRoutes")
const { UPLOAD_DIR } = require("./utils/upload")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff") }))

app.get("/", (req, res) => {
    res.json({ status: "ok", service: "BooksShop API" })
})

app.use("/", bookRoutes, userRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
