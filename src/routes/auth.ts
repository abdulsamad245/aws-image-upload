import express from 'express';
import passport from 'passport';
import { login, register, logout } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/login', passport.authenticate('local'), login);
authRouter.post('/register', register);
authRouter.get('/logout', logout);

export default authRouter;
