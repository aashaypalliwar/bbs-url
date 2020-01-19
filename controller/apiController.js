const apiRouter = require('express').Router();
const authRouter = require('./authController');
const userRouter = require('./userController');
const suborgRouter = require('./suborgController');
const adminRouter = require('./adminController');

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/suborg', suborgRouter);
apiRouter.use('/admin', adminRouter);

module.exports = apiRouter
