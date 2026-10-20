const Book = require("../models/Book")
const { removeFiles, urlOf, MAX_IMAGES } = require("../utils/upload")

const isOwnerOrAdmin = (book, user) =>
    String(book.user?._id || book.user) === String(user.id) || ["admin", "superAdmin"].includes(user.role)

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")


exports.getBooks = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 100)
    const skip = (page - 1) * limit

    const search = String(req.query.search || "").trim()
    const filter = search
        ? {
            $or: [
                { nomi: { $regex: escapeRegex(search), $options: "i" } },
                { muallifi: { $regex: escapeRegex(search), $options: "i" } },
                { Janr: { $regex: escapeRegex(search), $options: "i" } }
            ]
        }
        : {}

    const sort = req.query.sort === "newest" ? { _id: -1 } : { _id: 1 }

    const [books, totalBooks] = await Promise.all([
        Book.find(filter).sort(sort).skip(skip).limit(limit).populate("user", "ism familiya"),
        Book.countDocuments(filter)
    ])

    const totalPages = Math.ceil(totalBooks / limit)

    res.status(200).json({
        books,
        pagination: {
            page,
            limit,
            totalBooks,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    })
}

exports.getBookById = async (req, res) => {
    const book = await Book.findById(req.params.id).populate("user", "ism familiya")

    if (!book) {
        return res.status(404).json({ message: "Kitob topilmadi!" })
    }

    res.status(200).json(book)
}

exports.createBook = async (req, res) => {
    console.log("BACKEND QABUL QILDI:", req.body)

    const images = (req.files || []).map(urlOf)
    const book = await Book.create({
        ...req.body,
        images,
        user: req.user.id,
    })

    await book.populate("user", "ism familiya")
    res.status(201).json(book)
}

exports.editBook = async (req, res) => {
    const book = await Book.findById(req.params.id)

    const uploaded = req.files || []

    if (!book) {
        removeFiles(uploaded)
        return res.status(404).json({ message: "Kitob topilmadi!" })
    }
    if (!isOwnerOrAdmin(book, req.user)) {
        removeFiles(uploaded)
        return res.status(403).json({ message: "Bu kitobni o'zgartirish huquqingiz yo'q" })
    }

    const { removeImages = [], ...fields } = req.body
    const toRemove = book.images.filter((image) => removeImages.includes(image))
    const kept = book.images.filter((image) => !toRemove.includes(image))

    if (kept.length + uploaded.length > MAX_IMAGES) {
        removeFiles(uploaded)
        return res.status(400).json({ message: `Bitta kitobda ko'pi bilan ${MAX_IMAGES} ta rasm bo'lishi mumkin` })
    }

    Object.assign(book, fields)
    book.images = [...kept, ...uploaded.map(urlOf)]
    await book.save()
    removeFiles(toRemove)
    await book.populate("user", "ism familiya")

    res.status(200).json(book)
}

exports.deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id)

    if (!book) {
        return res.status(404).json({ message: "Kitob topilmadi!" })
    }
    if (!isOwnerOrAdmin(book, req.user)) {
        return res.status(403).json({ message: "Bu kitobni o'chirish huquqingiz yo'q" })
    }

    await book.deleteOne()
    removeFiles(book.images)
    res.status(200).json({ message: "O'chirildi!" })
}

exports.countBook = async (req, res) => {
    const match = req.query.muallifi ? { muallifi: String(req.query.muallifi) } : {}

    const result = await Book.aggregate([
        { $match: match },
        { $group: { _id: "$muallifi", totalBooks: { $sum: 1 } } },
        { $sort: { totalBooks: -1 } }
    ])

    res.status(200).json(result)
}
