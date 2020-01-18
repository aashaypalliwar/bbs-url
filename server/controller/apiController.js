const apiRouter = require('express').Router();
const authRouter = require('./authController');
const userRouter = require('./userController');
const adminRouter = require('./adminController');

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/admin', adminRouter);

module.exports = apiRouter
