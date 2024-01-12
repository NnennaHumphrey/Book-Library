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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_model_1 = require("../models/users.model");
const users_validation_1 = require("../schema/users.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const jwtSecret = process.env.secret || 'yourFallbackSecret';
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = (0, users_validation_1.validateUser)(req.body), { confirmPassword } = _a, validatedUser = __rest(_a, ["confirmPassword"]);
        if (validatedUser instanceof Error) {
            return res.status(400).json({ success: false, message: validatedUser.message });
        }
        if (validatedUser.password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        const existingUser = yield users_model_1.User.findOne({ email: validatedUser.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(validatedUser.password, 10);
        const newUser = new users_model_1.User({
            authorName: validatedUser.authorName,
            email: validatedUser.email,
            password: hashedPassword,
            phoneNumber: validatedUser.phoneNumber,
        });
        yield newUser.save();
        return res.status(201).json({ success: true, message: 'User created successfully.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: "Invalid email or password format" });
        }
        const user = yield users_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const accessToken = (0, auth_middleware_1.generateAccessToken)(user);
        const userId = user.id;
        req.session.token = accessToken;
        req.session.userId = userId;
        req.session.authorName = user.authorName;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.login = login;
