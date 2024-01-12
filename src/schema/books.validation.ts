import { z, ZodError } from 'zod';

const BookSchema = z.object({
  title: z.string().min(1).max(255),
  datePublished: z.string().min(1), // treat datePublished as string
  description: z.string().min(1),
  pageCount: z.number().int().positive(),
  genre: z.string().min(1),
  publisher: z.string().min(1),
});

export type BookInput = z.infer<typeof BookSchema>;

export const validateBook = (data: unknown): BookInput => {
  try {
    return BookSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Construct a detailed error message with individual error details
      const errorMessages = error.errors.map((err) => err.message).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    } else {
      throw error;
    }
  }
};

export default BookSchema;
