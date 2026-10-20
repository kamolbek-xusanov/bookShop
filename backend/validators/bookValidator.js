
const { z } = require("zod")

const bool = z.union([
    z.boolean(),
    z.enum(["true", "false"]).transform((value) => value === "true")
])

const optionalNumber = (schema) =>
    z.preprocess(
        (value) => value === "" || value == null ? undefined : value,
        schema.optional()
    )

const createBookSchema = z.object({
    nomi: z.string().min(4),
    sahifasi: z.coerce.number().min(1),
    muallifi: z.string().min(3),
    Janr: z.string(),
    sotuvdaBor: bool,

    tavsif: z.string().optional(),
    tili: z.string().optional(),
    nashrYili: optionalNumber(z.coerce.number().int().min(1000).max(2100)),
    narxi: optionalNumber(z.coerce.number().min(0))
})

const updateBookSchema = createBookSchema.partial().extend({
    removeImages: z.union([z.string(), z.array(z.string())])
        .transform((value) => Array.isArray(value) ? value : [value])
        .optional()
})

module.exports = { createBookSchema, updateBookSchema }
