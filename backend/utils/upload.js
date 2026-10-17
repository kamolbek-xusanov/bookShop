const multer = require("multer")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")

const MAX_IMAGES = 5
const MAX_SIZE = 5 * 1024 * 1024
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"))
const URL_PREFIX = "/uploads/"

const EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true })
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString("hex") + EXTENSIONS[file.mimetype])
})

const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE, files: MAX_IMAGES },
    fileFilter: (req, file, cb) => {
        if (!EXTENSIONS[file.mimetype]) {
            const error = new Error("Faqat JPG, PNG, WEBP yoki GIF rasm yuklash mumkin")
            error.status = 400
            return cb(error)
        }
        cb(null, true)
    }
})

function looksLikeImage(file) {
    const buffer = Buffer.alloc(12)
    const fd = fs.openSync(file.path, "r")
    try {
        fs.readSync(fd, buffer, 0, 12, 0)
    } finally {
        fs.closeSync(fd)
    }

    switch (file.mimetype) {
        case "image/jpeg": return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
        case "image/png": return buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
        case "image/gif": return buffer.subarray(0, 4).toString("latin1") === "GIF8"
        case "image/webp": return buffer.subarray(0, 4).toString("latin1") === "RIFF" && buffer.subarray(8, 12).toString("latin1") === "WEBP"
        default: return false
    }
}

const urlOf = (file) => URL_PREFIX + file.filename

function removeFiles(items = []) {
    for (const item of items) {
        const target = typeof item === "string"
            ? (item.startsWith(URL_PREFIX) ? path.join(UPLOAD_DIR, path.basename(item)) : null)
            : item.path
        if (target) fs.unlink(target, () => { })
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
            removeFiles(req.files)
            if (error instanceof multer.MulterError) {
                return res.status(400).json({ message: messages[error.code] || error.message })
            }
            next(error)
        })
    },
    (req, res, next) => {
        const files = req.files || []
        if (files.every(looksLikeImage)) return next()
        removeFiles(files)
        res.status(400).json({ message: "Yuklangan fayl rasm emas" })
    }
]

module.exports = { uploadImages, removeFiles, urlOf, UPLOAD_DIR, MAX_IMAGES }
