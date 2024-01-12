// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { Book, IBookDocument, BookInput } from '../src/models/books.model';

// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   mongoServer = new MongoMemoryServer();
//   const mongoUri = await mongoServer.getUri();
//   await mongoose.connect(mongoUri);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe('Book Model', () => {
//   it('should save a book to the in-memory database', async () => {
//     const bookData: BookInput = {
//       title: 'Sample Book',
//       datePublished: new Date(),
//       description: 'Sample description',
//       pageCount: 200,
//       genre: 'Sample Genre',
//       publisher: 'Sample Publisher',
//     };

//     const book = new Book(bookData);
//     await book.save();

//     const foundBook = await Book.findOne({ title: 'Sample Book' }) as IBookDocument;
//     expect(foundBook).toBeDefined();
//     expect(foundBook.title).toBe('Sample Book');
//   });

//   it('should throw an error for invalid book data', async () => {
//     const invalidBookData: BookInput = {
//       title: '', // Invalid title
//       datePublished: new Date(),
//       description: 'Sample description',
//       pageCount: 200,
//       genre: 'Sample Genre',
//       publisher: 'Sample Publisher',
//     };

//     const invalidBook = new Book(invalidBookData);

//     // Ensure that the save operation throws an error due to validation failure
//     await expect(invalidBook.save()).rejects.toThrow('Book validation failed');
//   });
// });
