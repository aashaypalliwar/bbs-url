const { incrementUserURL, decrementUserURL } = require('../model/businessLogic/userLogic');
const { protect } = require('../model/businessLogic/authLogic');
const { createNewShortURL, getURLsByUser, deleteURL } = require('../model/businessLogic/url/urlLogic');
// const sendEmail = require('./../utils/email');

const userRouter = require('express').Router();

//userRouter.use(protect);
//change protect routine.
//Create a new short URL
userRouter.post('/url', async (req,res,next) => {
    try{
        let urlInfo = {
            email: req.body.email,
            name: req.body.name,
            userID: req.body._id,
            originalURL: req.body.originalURL,
            wantCustomURL: req.body.wantCustomURL,
            customURL: req.body.customURL
        }

        let newURLData = await createNewShortURL(urlInfo, next);
        if(newURLData) {
            res.status(200).json({
                newURLData
            });
            //await incrementUserURL(req.user._id, next);
        }
    }
    catch(err){
        next(err);
    }
});

// Get all the URLs created by a user
userRouter.get('/url', async (req,res,next) => {
    try{
        let URLData = await getURLsByUser(req.user, next);
        if(URLData) {
            res.status(200).json({
                URLData
            });
        }
    }
    catch(err){
        next(err);
    }
});

//Delete a previously created short URL
userRouter.delete('/url', async (req,res,next) => {
    try{
        let deletedURL = await deleteURL(req.body._id, req.user._id, next);
        if(deletedURL) {
            res.status(204).json({
                status: 'deleted'
            });
            await decrementUserURL(req.user._id);
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = userRouter;
