import 'dotenv/config'
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.route';
import bookRoutes from './routes/books.route';
import userRoutes from './routes/users.route';
import mongoose from 'mongoose';
import session from 'express-session';

const mongoURI = process.env.DATABASE_URL as string;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..','public')));

app.use(
  session({
    secret: `${process.env.secret}` , 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  next();
});

app.use('/', indexRouter);
console.log("here");
app.use('/books', bookRoutes);
app.use('/users', userRoutes);


app.use((_req, _res, next) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
