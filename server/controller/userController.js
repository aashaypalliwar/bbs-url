const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/dbModel/userModel');
const AppError = require('../utils/appError');
const config = require('../utils/config');
const { createNewUser, getUserInfo, incrementUserURL, decrementUserURL } = require('../model/businessLogic/userLogic');
const { protect } = require('../model/businessLogic/authLogic');
const { createNewShortURL, getURLsByUser, deleteURL } = require('../model/businessLogic/url/urlLogic');
// const sendEmail = require('./../utils/email');

const userRouter = require('express').Router();

userRouter.use(protect);

userRouter.post('/url', async (req,res,next) => {
    try{
        req.user.originalURL = req.body.originalURL;
        let newURLData = await createNewShortURL(req.user);
        res.status(200).json({
           newURLData
        });
        await incrementUserURL(req.user._id);
    }
    catch(err){
        next(err);
    }
});

userRouter.get('/url', async (req,res,next) => {
    try{
        let URLData = await getURLsByUser(req.user);
        res.status(200).json({
            URLData
        });
    }
    catch(err){
        next(err);
    }
});

userRouter.delete('/url', async (req,res,next) => {
    try{
        await deleteURL(req.body._id);
        res.status(204).json({
            status: 'deleted'
        });
        await decrementUserURL(req.user._id);

    }
    catch(err){
        next(err);
    }
});






module.exports = userRouter;
