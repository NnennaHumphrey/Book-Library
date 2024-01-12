import { Request, Response } from "express";
import mongoose from "mongoose";
import { Book, IBookDocument } from '../models/books.model';
import { validateBook } from '../schema/books.validation';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No books found.' });
    }
    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBooksForUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    const userBooks = await Book.find({ userId });
    res.status(200).json({ userBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ...

export const createBook = async (req: Request, res: Response) => {
  const userId = (req.session as any).userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    validateBook(req.body);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }

  const { title, datePublished, description, pageCount, genre, publisher } = req.body;
  const newBook = new Book({
    title,
    datePublished,
    description,
    pageCount,
    genre,
    publisher,
    userId,
  });

  await newBook.save();
  res.status(201).json({ message: 'Book created successfully.' });
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    validateBook(req.body);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }

  const { title, datePublished, description, pageCount, genre, publisher } = req.body;
  const book = await Book.findByIdAndUpdate(req.params.id, {
    title,
    datePublished,
    description,
    pageCount,
    genre,
    publisher,
  });

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.status(200).json({ message: 'Book updated successfully.' });
};

// ...


export const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid bookId.' });
  }

  const deletedBook = await Book.findByIdAndDelete(bookId);

  if (!deletedBook) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.status(200).json({ message: 'Book deleted successfully.' });
};
