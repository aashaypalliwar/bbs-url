const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/dbModel/userModel');
const AppError = require('../utils/appError');
const config = require('../utils/config');
const { createNewUser, getUserInfo, incrementUserURL } = require('../model/businessLogic/userLogic');
const { protect } = require('../model/businessLogic/authLogic');
const { createNewShortURL } = require('../model/businessLogic/url/urlLogic');
// const sendEmail = require('./../utils/email');

const userRouter = require('express').Router();

userRouter.post('/create', protect, async (req,res,next) => {
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





module.exports = userRouter;
