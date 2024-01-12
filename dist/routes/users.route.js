"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/signup', users_controller_1.signup);
router.post('/login', users_controller_1.login, auth_middleware_1.authenticateToken);
exports.default = router;
