const { z } = require("zod")

// multipart forms send every value as a string, JSON sends real numbers/booleans: accept both
const bool = z.union([z.boolean(), z.enum(["true", "false"]).transform((value) => value === "true")])

const createBookSchema = z.object({
    nomi: z.string().min(4),
    sahifasi: z.coerce.number().min(1),
    muallifi: z.string().min(3),
    Janr: z.string(),
    sotuvdaBor: bool
})

// removeImages: stored paths of the images to delete (one value or a list)
const updateBookSchema = createBookSchema.partial().extend({
    removeImages: z.union([z.string(), z.array(z.string())])
        .transform((value) => (Array.isArray(value) ? value : [value]))
        .optional()
})

module.exports = { createBookSchema, updateBookSchema }
