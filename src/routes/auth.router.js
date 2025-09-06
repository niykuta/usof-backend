import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/password-reset', reset);
authRouter.post('/password-reset/:confirm_token', confirm);

export { authRouter };
