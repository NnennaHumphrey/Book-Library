"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = require("../models/users.model"); // Fix the import statement
const users_validation_1 = require("../schema/users.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { authorName, email, password, phoneNumber }: UserInput = userSchema.parse(req.body);
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//        res.status(400).json({ message: 'Email is already registered' });
//        return;  // Add a return statement to exit the function
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       authorName,
//       email,
//       password: hashedPassword,
//       phoneNumber,
//     });
//     console.log('New user registered:', newUser);
//     res.status(201).json({ message: 'User registered successfully', user: newUser });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'User registration unsuccessful' });
//   }
// };
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = users_validation_1.userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const { authorName, email, password, phoneNumber } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        const existingUser = yield users_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new users_model_1.User({
            authorName,
            email,
            password: hashedPassword,
            phoneNumber,
        });
        yield newUser.save();
        // Send success message in the response
        return res.status(201).json({ success: true, message: 'User created successfully.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }
    const user = yield users_model_1.User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const accessToken = (0, auth_middleware_1.generateAccessToken)(user);
    const userId = user.id;
    req.session.token = accessToken;
    req.session.userId = userId;
    req.session.authorName = user.authorName;
    next();
});
exports.login = login;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Add a return statement to exit the function
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Add a return statement to exit the function
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.loginUser = loginUser;
