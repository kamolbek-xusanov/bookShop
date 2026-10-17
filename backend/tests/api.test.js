process.env.JWT_SECRET = "test_secret"
process.env.NODE_ENV = "test"

const { test, before, after } = require("node:test")
const assert = require("node:assert/strict")
const jwt = require("jsonwebtoken")
const app = require("../app")
const otp = require("../utils/otp")

let server
let base

const token = (role) => jwt.sign({ id: "64b000000000000000000001", role, ism: "Test" }, process.env.JWT_SECRET)

async function call(method, path, { auth, body, raw } = {}) {
    const res = await fetch(base + path, {
        method,
        headers: {
            ...(raw === undefined ? { "Content-Type": "application/json" } : { "Content-Type": "application/json" }),
            ...(auth ? { Authorization: `Bearer ${auth}` } : {})
        },
        body: raw !== undefined ? raw : body ? JSON.stringify(body) : undefined
    })
    return { status: res.status, data: await res.json().catch(() => null) }
}

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, resolve)
    })
    base = `http://localhost:${server.address().port}`
})

after(() => server.close())

test("health check and unknown routes", async () => {
    assert.equal((await call("GET", "/")).status, 200)
    assert.equal((await call("GET", "/nope")).status, 404)
})

test("protected routes need a valid token", async () => {
    assert.equal((await call("POST", "/books", { body: {} })).status, 401)
    assert.equal((await call("DELETE", "/books/64b000000000000000000001")).status, 401)
    assert.equal((await call("GET", "/users")).status, 401)
    assert.equal((await call("GET", "/users/profile", { auth: "abc.def.ghi" })).status, 401)
})

test("roles are enforced", async () => {
    assert.equal((await call("GET", "/users", { auth: token("user") })).status, 403)
    assert.equal((await call("GET", "/books/stats", { auth: token("user") })).status, 403)
    assert.equal((await call("GET", "/admin", { auth: token("admin") })).status, 200)
    assert.equal((await call("GET", "/admin", { auth: token("user") })).status, 403)
    assert.equal((await call("GET", "/superAdmin", { auth: token("admin") })).status, 403)
    // only a superAdmin may manage users
    assert.equal((await call("DELETE", "/users/64b000000000000000000009", { auth: token("admin") })).status, 403)
})

test("deleting yourself is not allowed", async () => {
    const res = await call("DELETE", "/users/64b000000000000000000001", { auth: token("superAdmin") })
    assert.equal(res.status, 400)
})

test("request bodies are validated", async () => {
    assert.equal((await call("POST", "/books", { auth: token("user"), body: { nomi: "a" } })).status, 400)
    assert.equal((await call("POST", "/users/register", { body: { ism: "Kamol", yosh: 20, email: "bad", password: "123456" } })).status, 400)
    assert.equal((await call("POST", "/users/login", { body: { email: "a@b.com", password: "1" } })).status, 400)
    assert.equal((await call("POST", "/users", { auth: token("superAdmin"), body: { ism: "Test", yosh: 20, email: "a@b.com", password: "123456", role: "god" } })).status, 400)
    assert.equal((await call("POST", "/users/login", { raw: "{not json" })).status, 400)
})

test("ids are validated", async () => {
    assert.equal((await call("GET", "/books/abc")).status, 400)
    assert.equal((await call("DELETE", "/books/abc", { auth: token("user") })).status, 400)
})

test("OTP routes validate input and never leak the code", async () => {
    assert.equal((await call("POST", "/books/send", { body: { email: "bad" } })).status, 400)
    assert.equal((await call("POST", "/users/verify-otp", { body: { email: "a@b.com", otp: 123456 } })).status, 400)
})

test("OTP service: expiry-safe, single use, case-insensitive email", () => {
    const code = otp.create("Test@Mail.com")
    assert.equal(otp.verify("test@mail.com", "000000").ok, false)
    assert.equal(otp.verify("test@mail.com", code).ok, true)
    assert.equal(otp.verify("test@mail.com", code).ok, false)
})

test("OTP service: too many wrong attempts invalidate the code", () => {
    const code = otp.create("limit@mail.com")
    for (let i = 0; i < 5; i++) otp.verify("limit@mail.com", "000000")
    assert.equal(otp.verify("limit@mail.com", code).ok, false)
})

const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64")

async function postBook(files, auth = token("user")) {
    const form = new FormData()
    form.append("nomi", "Clean Code")
    form.append("muallifi", "Robert Martin")
    form.append("sahifasi", "464")
    form.append("Janr", "Programming")
    form.append("sotuvdaBor", "true")
    for (const { data, type, name } of files) form.append("images", new Blob([data], { type }), name)

    const res = await fetch(base + "/books", { method: "POST", headers: { Authorization: `Bearer ${auth}` }, body: form })
    return { status: res.status, data: await res.json().catch(() => null) }
}

test("book images: more than 5 files are rejected", async () => {
    const files = Array.from({ length: 6 }, (_, i) => ({ data: tinyPng, type: "image/png", name: `a${i}.png` }))
    const res = await postBook(files)
    assert.equal(res.status, 400)
    assert.match(res.data.message, /5 ta rasm/)
})

test("book images: only real images are accepted", async () => {
    const wrongType = await postBook([{ data: "hello", type: "text/plain", name: "a.txt" }])
    assert.equal(wrongType.status, 400)

    // claims to be a PNG but the content is text
    const fake = await postBook([{ data: "not really a png", type: "image/png", name: "a.png" }])
    assert.equal(fake.status, 400)
    assert.match(fake.data.message, /rasm emas/)
})

test("book images: a book still needs valid fields and a login", async () => {
    assert.equal((await postBook([], "bad.token.here")).status, 401)

    const form = new FormData()
    form.append("nomi", "a")
    form.append("images", new Blob([tinyPng], { type: "image/png" }), "a.png")
    const res = await fetch(base + "/books", { method: "POST", headers: { Authorization: `Bearer ${token("user")}` }, body: form })
    assert.equal(res.status, 400)
})

test("uploaded files are removed when validation fails", async () => {
    const fs = require("node:fs")
    const { UPLOAD_DIR } = require("../utils/upload")
    const before = fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR).length : 0

    const form = new FormData()
    form.append("nomi", "a")
    form.append("images", new Blob([tinyPng], { type: "image/png" }), "a.png")
    await fetch(base + "/books", { method: "POST", headers: { Authorization: `Bearer ${token("user")}` }, body: form })
    await new Promise((resolve) => setTimeout(resolve, 100))

    const after = fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR).length : 0
    assert.equal(after, before)
})

test("google sign-in: validates input and needs configuration", async () => {
    delete process.env.GOOGLE_CLIENT_ID
    assert.equal((await call("POST", "/users/google", { body: {} })).status, 400)
    assert.equal((await call("POST", "/users/google", { body: { credential: "x".repeat(40) } })).status, 503)
})

test("google sign-in: rejects a token Google does not accept", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com"
    const res = await call("POST", "/users/google", { body: { credential: "not.a.real.google.token.at.all" } })
    delete process.env.GOOGLE_CLIENT_ID
    assert.equal(res.status, 401)
})

test("google sign-in: creates a user for a verified Google account and returns a JWT", async () => {
    const { OAuth2Client } = require("google-auth-library")
    const User = require("../models/User")
    const original = { verify: OAuth2Client.prototype.verifyIdToken, findOne: User.findOne, create: User.create }

    OAuth2Client.prototype.verifyIdToken = async () => ({
        getPayload: () => ({ sub: "g-1", email: "New.User@Gmail.com", email_verified: true, given_name: "Ali", family_name: "Valiyev", picture: "http://x/y.png" })
    })
    User.findOne = async () => null
    User.create = async (data) => ({ _id: "64b0000000000000000000aa", role: "user", ...data })
    process.env.GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com"

    try {
        const res = await call("POST", "/users/google", { body: { credential: "x".repeat(40) } })
        assert.equal(res.status, 201)
        assert.equal(res.data.isNew, true)
        assert.equal(res.data.user.email, "new.user@gmail.com")
        const payload = jwt.verify(res.data.token, process.env.JWT_SECRET)
        assert.equal(payload.role, "user")
        assert.equal(res.data.user.password, undefined)

        OAuth2Client.prototype.verifyIdToken = async () => ({ getPayload: () => ({ sub: "g-2", email: "a@b.com", email_verified: false }) })
        assert.equal((await call("POST", "/users/google", { body: { credential: "x".repeat(40) } })).status, 401)
    } finally {
        OAuth2Client.prototype.verifyIdToken = original.verify
        User.findOne = original.findOne
        User.create = original.create
        delete process.env.GOOGLE_CLIENT_ID
    }
})
