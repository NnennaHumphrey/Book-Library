// users.controller.ts
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
import { userSchema, UserInput, validateUser } from '../schema/users.validation';
import { generateAccessToken, CustomRequest } from "../middlewares/auth.middleware";

const jwtSecret: string = process.env.secret || 'yourFallbackSecret';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { confirmPassword, ...validatedUser } = validateUser(req.body);

    if (validatedUser instanceof Error) {
      return res.status(400).json({ success: false, message: validatedUser.message });
    }

    if (validatedUser.password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: validatedUser.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

    const newUser = new User({
      authorName: validatedUser.authorName,
      email: validatedUser.email,
      password: hashedPassword,
      phoneNumber: validatedUser.phoneNumber,
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: 'User created successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const login = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid email or password format" });
    }

    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const userId = user.id;

    req.session.token = accessToken;
    req.session.userId = userId;
    req.session.authorName = user.authorName;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
