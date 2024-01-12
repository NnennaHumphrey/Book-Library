"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const users_controller_1 = require("../controllers/users.controller");
const router = express_1.default.Router();
router.post('/register', users_controller_1.registerUser);
router.post('/login', users_controller_1.loginUser);
// Protect routes below this line with authentication
router.use(auth_middleware_1.authenticateUser);
// Example protected route
router.get('/protected', (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});
exports.default = router;
