import express from 'express';
import {
  signup,
  login,
} from '../controllers/users.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login, authenticateToken );

export default router;
