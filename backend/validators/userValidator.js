const { z } = require("zod")

const email = z.string().trim().toLowerCase().email()
const role = z.enum(["user", "admin", "superAdmin", "menejer"])

const registerSchema = z.object({
    ism: z.string().trim().min(2),
    familiya: z.string().trim().min(2).optional(),
    yosh: z.number().min(1).max(120),
    email,
    password: z.string().min(6)
})

const loginSchema = z.object({
    email,
    password: z.string().min(6)
})

// superAdmin can also choose the role
const adminCreateUserSchema = registerSchema.extend({ role: role.optional() })
const updateUserSchema = adminCreateUserSchema.partial()

const googleSchema = z.object({ credential: z.string().min(20) })

const otpEmailSchema = z.object({ email })
const otpVerifySchema = z.object({
    email,
    otp: z.union([z.string(), z.number()]).transform(String)
})

module.exports = {
    registerSchema,
    loginSchema,
    adminCreateUserSchema,
    updateUserSchema,
    googleSchema,
    otpEmailSchema,
    otpVerifySchema
}
