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
    forgotPassword,
    sendVerificationEmail,
    verifyEmail
} = require('../model/businessLogic/authLogic');
// const sendEmail = require('./../utils/email');
const authRouter = require('express').Router();


authRouter.post('/signup', async (req, res, next) => {
    try{
        let newUser = await createNewUser(req.body, next);
        await sendVerificationEmail(newUser, 201, res);
    }
    catch(err){
        console.log(err);
        return new AppError('something went wrong while signing up', 400);
    }
});

authRouter.post('/login', async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }
        // 2) Check if user exists && password is correct
        const user = await getUserInfo(email, next);

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }
        // 3) Check if user verified
        if(!user.emailVerified){
            return res.status(200).json({
                status: 'success',
                message: 'Please verify your email'
            });
        }

        // 4) If everything ok, send token to client
        createSendToken(user, 200, res);
    }
    catch(err){
        return next(err);
    }

});

authRouter.post('/verifyEmail', async (req, res, next) => {
    try{
        const { email, verificationToken } = req.body;

        // 1) Check if email and password exist
        if (!email || !verificationToken ) {
            return next(new AppError('Please provide email and verification token!', 400));
        }
        // 2) Check if user exists
        const user = await getUserInfo(email, next);
        if (!user) {
            return next(new AppError('Incorrect email.', 401));
        }
        // 3) Verify user
        let verified = await verifyEmail(user, verificationToken);
        if(verified){
            return createSendToken(user, 200, res);
        }else{
            return next(new AppError('Please enter the correct verification token', 401));
        }
    }
    catch(err){
        return next(err);
    }


});

authRouter.post('/resendVerificationEmail', async (req, res, next) => {
    try{
        const { email } = req.body;

        // 1) Check if email and password exist
        if (!email ) {
            return next(new AppError('Please provide email!', 400));
        }
        // 2) Check if user exists
        const user = await getUserInfo(email, next);
        if (!user) {
            return next(new AppError('User doesnt exist.', 401));
        }
        // 3) Resend
        if(user.emailVerified){
            return next(new AppError('User already verified.', 401));
        }
        else{
            await sendVerificationEmail(user, 200, res);
        }
    }
    catch(err){
        return next(err);
    }

});

authRouter.post('/forgotPassword', forgotPassword);

authRouter.post('/resetPassword', resetPassword);

authRouter.post('/updatePassword', updatePassword);

module.exports = authRouter;
