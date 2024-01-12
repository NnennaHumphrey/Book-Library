// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { User, IUser } from '../src/models/users.model';

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

// describe('User Model', () => {
//   it('should save a user to the in-memory database', async () => {
//     const userData: IUser = {
//       authorName: 'John Doe',
//       email: 'john.doe@example.com',
//       password: 'password123',
//       phoneNumber: '1234567890',
//       books: [],
//     };

//     const user = new User(userData);
//     await user.validateAndSave();

//     const foundUser = await User.findOne({ email: 'john.doe@example.com' }) as IUser;
//     expect(foundUser).toBeDefined();
//     expect(foundUser.authorName).toBe('John Doe');
//   });

//   it('should add a book to the user', async () => {
//     const userData: IUser = {
//       authorName: 'Jane Doe',
//       email: 'jane.doe@example.com',
//       password: 'password456',
//       phoneNumber: '9876543210',
//       books: [],
//     };

//     const user = new User(userData);
//     await user.validateAndSave();

//     const bookData = {
//       title: 'Sample Book',
//       datePublished: new Date(),
//       description: 'Sample description',
//       pageCount: 200,
//       genre: 'Sample Genre',
//       publisher: 'Sample Publisher',
//     };

//     await user.addBook(bookData);

//     const foundUser = await User.findOne({ email: 'jane.doe@example.com' }).populate('books') as IUser;
//     expect(foundUser).toBeDefined();
//     expect(foundUser.books.length).toBe(1);
//     expect(foundUser.books[0].title).toBe('Sample Book');
//   });

//   it('should throw an error for invalid user data', async () => {
//     const invalidUserData: IUser = {
//       authorName: '',
//       email: 'invalid-email', // Invalid email
//       password: 'password789',
//       phoneNumber: '9876543210',
//       books: [],
//     };

//     const invalidUser = new User(invalidUserData);

//     // Ensure that the validateAndSave operation throws an error due to validation failure
//     await expect(invalidUser.validateAndSave()).rejects.toThrow('User validation failed');
//   });

//   it('should throw an error for invalid book data', async () => {
//     const userData: IUser = {
//       authorName: 'Invalid User',
//       email: 'invalid.user@example.com',
//       password: 'password789',
//       phoneNumber: '9876543210',
//       books: [],
//     };

//     const user = new User(userData);

//     const invalidBookData = {
//       title: '', // Invalid title
//       datePublished: new Date(),
//       description: 'Sample description',
//       pageCount: 200,
//       genre: 'Sample Genre',
//       publisher: 'Sample Publisher',
//     };

//     // Ensure that the addBook operation throws an error due to validation failure
//     await expect(user.addBook(invalidBookData)).rejects.toThrow('Book validation failed');
//   });
// });
