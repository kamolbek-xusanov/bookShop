const multer = require("multer")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const Image = require("../models/image")

const MAX_IMAGES = 5
const MAX_SIZE = 5 * 1024 * 1024
// Eski (diskka saqlangan) rasmlar uchun
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"))
const URL_PREFIX = "/uploads/"

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"]

// Fayllar avval xotirada turadi, faqat validatsiyadan o'tgach bazaga yoziladi
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE, files: MAX_IMAGES },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
            const error = new Error("Faqat JPG, PNG, WEBP yoki GIF rasm yuklash mumkin")
            error.status = 400
            return cb(error)
        }
        cb(null, true)
    }
})

function looksLikeImage(file) {
    const buffer = file.buffer

    switch (file.mimetype) {
        case "image/jpeg": return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
        case "image/png": return buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
        case "image/gif": return buffer.subarray(0, 4).toString("latin1") === "GIF8"
        case "image/webp": return buffer.subarray(0, 4).toString("latin1") === "RIFF" && buffer.subarray(8, 12).toString("latin1") === "WEBP"
        default: return false
    }
}

// Rasmlarni bazaga yozadi va ularning "/uploads/<id>" yo'llarini qaytaradi
async function saveImages(files = []) {
    const urls = []
    for (const file of files) {
        const image = await Image.create({ data: file.buffer, contentType: file.mimetype })
        urls.push(URL_PREFIX + image._id)
    }
    return urls
}

const imageIdOf = (url) => {
    const id = typeof url === "string" && url.startsWith(URL_PREFIX) ? url.slice(URL_PREFIX.length) : null
    return id && mongoose.isValidObjectId(id) && id.length === 24 ? id : null
}

// Kitob yoki rasm o'chirilganda ularning yo'llari beriladi
function removeFiles(items = []) {
    for (const item of items) {
        if (typeof item !== "string" || !item.startsWith(URL_PREFIX)) continue

        const id = imageIdOf(item)
        if (id) {
            Image.findByIdAndDelete(id).catch(() => { })
        } else {
            fs.unlink(path.join(UPLOAD_DIR, path.basename(item)), () => { })
        }
    }
}

const messages = {
    LIMIT_FILE_SIZE: "Har bir rasm 5 MB dan oshmasligi kerak",
    LIMIT_FILE_COUNT: `Ko'pi bilan ${MAX_IMAGES} ta rasm yuklash mumkin`,
    LIMIT_UNEXPECTED_FILE: `Ko'pi bilan ${MAX_IMAGES} ta rasm yuklash mumkin`
}

const uploadImages = [
    (req, res, next) => {
        upload.array("images", MAX_IMAGES)(req, res, (error) => {
            if (!error) return next()
            if (error instanceof multer.MulterError) {
                return res.status(400).json({ message: messages[error.code] || error.message })
            }
            next(error)
        })
    },
    (req, res, next) => {
        const files = req.files || []
        if (files.every(looksLikeImage)) return next()
        res.status(400).json({ message: "Yuklangan fayl rasm emas" })
    }
]

// GET /uploads/:id — bazadagi rasmni qaytaradi
async function serveImage(req, res, next) {
    // 24 belgili id bo'lmasa (eski fayl nomi), keyingi handlerga (static) o'tadi
    if (!/^[0-9a-f]{24}$/i.test(req.params.id)) return next()

    try {
        const image = await Image.findById(req.params.id)
        if (!image) return next()

        res.set({
            "Content-Type": image.contentType,
            "Cache-Control": "public, max-age=604800, immutable",
            "X-Content-Type-Options": "nosniff"
        })
        res.send(image.data)
    } catch (error) {
        next(error)
    }
}

module.exports = { uploadImages, saveImages, removeFiles, serveImage, UPLOAD_DIR, MAX_IMAGES }