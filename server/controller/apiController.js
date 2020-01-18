const apiRouter = require('express').Router();
const authRouter = require('./authController');
const userRouter = require('./userController');

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter
