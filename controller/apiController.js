const apiRouter = require('express').Router();
const authRouter = require('./authController');
const userRouter = require('./userController');
const suborgRouter = require('./suborgController');
const adminRouter = require('./adminController');
const guestRouter = require('./guestController');

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/guest', guestRouter);
apiRouter.use('/suborg', suborgRouter);
apiRouter.use('/admin', adminRouter);

module.exports = apiRouter
