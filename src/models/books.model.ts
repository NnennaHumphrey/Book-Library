// Import necessary modules
import mongoose, { Schema, Document } from 'mongoose';
import { validateBook, BookInput } from '../schema/books.validation';
import { IUser } from '../models/users.model';

interface IBookDocument extends Document, BookInput {
  title: string;
  datePublished: string; // Change the type to string
  description: string;
  pageCount: number;
  genre: string;
  publisher: string;
  userId: mongoose.Schema.Types.ObjectId
}


// Define book schema
const bookSchema = new Schema<IBookDocument>(
  {
    title: { type: String, required: [true, 'Title is required'] },
    datePublished: { type: String, required: [true, 'Date published is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    pageCount: { type: Number, required: [true, 'Page count is required'] },
    genre: { type: String, required: [true, 'Genre is required'] },
    publisher: { type: String, required: [true, 'Publisher is required'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User ID
  },
  { timestamps: true }
);

// Method to validate and save book data before creating or updating
bookSchema.pre<IBookDocument>('save', async function (next) {
  const data: any = {
    title: this.title,
    datePublished: this.datePublished,
    description: this.description,
    pageCount: this.pageCount,
    genre: this.genre,
    publisher: this.publisher,
  };

  // Validate against custom book validation
  const isValid = validateBook(data);
  if (!isValid) {
    throw new Error('Book validation failed');
  }

  next();
});

// Create Book model
const Book = mongoose.model<IBookDocument>('Book', bookSchema);

// Export necessary entities
export { Book, IBookDocument, BookInput };
