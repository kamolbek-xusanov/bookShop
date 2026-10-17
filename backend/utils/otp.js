const crypto = require("crypto")

const TTL_MS = 5 * 60 * 1000 
const MAX_ATTEMPTS = 5  
const store = new Map()

exports.create = (email) => {
    const otp = String(crypto.randomInt(100000, 1000000))
    store.set(email.toLowerCase(), { otp, expiresAt: Date.now() + TTL_MS, attempts: 0 })
    return otp
}

exports.remove = (email) => store.delete(email.toLowerCase())

exports.verify = (email, otp) => {
    const key = email.toLowerCase()
    const entry = store.get(key)

    if (!entry) return { ok: false, message: "OTP topilmadi, qaytadan so'rang" }

    if (Date.now() > entry.expiresAt) {
        store.delete(key)
        return { ok: false, message: "OTP muddati tugagan" }
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
        store.delete(key)
        return { ok: false, message: "Juda ko'p urinish, qaytadan so'rang" }
    }

    entry.attempts++

    if (entry.otp !== String(otp)) return { ok: false, message: "Invalid OTP" }

    store.delete(key)
    return { ok: true }
}

setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
        if (entry.expiresAt < now) store.delete(key)
    }
}, 60 * 1000).unref()
