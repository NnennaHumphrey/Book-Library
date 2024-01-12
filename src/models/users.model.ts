import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { validateUser, UserInput } from '../schema/users.validation';
import { validateBook, BookInput } from '../schema/books.validation';
import { IBookDocument } from '../models/books.model';

interface IUser extends Document, UserInput {
  authorName: string;
  email: string;
  password: string;
  phoneNumber: string;
  books: PopulatedDoc<IBookDocument[]>; // Use PopulatedDoc for population
}

const userMongooseSchema = new Schema<IUser>(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }], // Reference to Book
  },
  { timestamps: true }
);

// Method to validate and save book data for a user
userMongooseSchema.methods.addBook = async function (bookData: BookInput): Promise<void> {
  const validatedBook = validateBook(bookData);
  if (!validatedBook) {
    throw new Error('Book validation failed');
  }

  const newBook = { ...validatedBook };
  this.books.push(newBook);
  await this.save();
};

// Method to validate and save user data
userMongooseSchema.methods.validateAndSave = async function (): Promise<IUser> {
  const userData: UserInput = {
    authorName: this.authorName,
    email: this.email,
    password: this.password,
    phoneNumber: this.phoneNumber,
    confirmPassword: this.confirmPassword, 
  };

  // Validate against Zod schema
  const isValid = validateUser(userData);
  if (!isValid) {
    throw new Error('User validation failed');
  }

  // Save the user data
  return this.save();
};

const User = mongoose.model<IUser>('User', userMongooseSchema);

export { User, IUser };
