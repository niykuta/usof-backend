import express from 'express';
import { validateRegister, validateLogin } from "#src/middlewares/validation.middleware.js";
import { register, login } from '#src/controllers/auth.controller.js'
import { hashPassword } from "#src/middlewares/hash.middleware.js";

const authRouter = express.Router();

authRouter.post('/register', validateRegister, hashPassword, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/logout', logout);
authRouter.post('/password-reset', reset);
authRouter.post('/password-reset/:confirm_token', confirm);

export { authRouter };
