"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBook = void 0;
const zod_1 = require("zod");
const BookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    datePublished: zod_1.z.string().min(1), // treat datePublished as string
    description: zod_1.z.string().min(1),
    pageCount: zod_1.z.number().int().positive(),
    genre: zod_1.z.string().min(1),
    publisher: zod_1.z.string().min(1),
});
const validateBook = (data) => {
    try {
        return BookSchema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // Construct a detailed error message with individual error details
            const errorMessages = error.errors.map((err) => err.message).join(', ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }
        else {
            throw error;
        }
    }
};
exports.validateBook = validateBook;
exports.default = BookSchema;
