const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/dbModel/userModel');
const AppError = require('../utils/appError');
const config = require('../utils/config');
const { createNewUser, getUserInfo } = require('../model/businessLogic/userLogic');
const {
    createSendToken,
    updatePassword,
    resetPassword,
    forgotPassword
} = require('../model/businessLogic/authLogic');
// const sendEmail = require('./../utils/email');
const authRouter = require('express').Router();


authRouter.post('/signup', async (req, res, next) => {
    try{
        let newUser = await createNewUser(req.body);
        createSendToken(newUser, 201, res);
    }
    catch(err){
        return new AppError('something went wrong', 400);
    }

});

authRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await getUserInfo(email);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

authRouter.post('/forgotPassword', forgotPassword);

authRouter.post('/resetPassword', resetPassword);

authRouter.post('/updatePassword', updatePassword);

module.exports = authRouter;
