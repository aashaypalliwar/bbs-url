const { getAllSuborgInfo } = require('../model/businessLogic/userLogic');
const { protect } = require('../model/businessLogic/authLogic');
const { createNewShortURL, getURLsByUser, deleteURL } = require('../model/businessLogic/url/urlLogic');

const userRouter = require('express').Router();

userRouter.use(protect);

//Create a new short URL
userRouter.post('/url', async (req,res,next) => {
    try{
        let urlInfo = {
            email: req.user.email,
            name: req.user.name,
            userID: req.user._id,
            originalURL: req.body.originalURL,
            wantCustomURL: req.body.wantCustomURL,
            customURL: req.body.customURL
        }

        let newURLData = await createNewShortURL(urlInfo, next);
        if(newURLData) {
            res.status(201).json({
                newURLData
            });
        }
    }
    catch(err){
        next(err);
    }
});

// Get all uncategorized URLs created by a user
userRouter.get('/url', async (req,res,next) => {
    try{
        let URLData = await getURLsByUser(req.user, "none", next);
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

// Get all suborg info of a user
userRouter.get('/suborg', async (req,res,next) => {
    try{
        let suborgInfo = await getAllSuborgInfo(req.user.email, next);
        if(suborgInfo) {
            res.status(200).json({
                categories: suborgInfo
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
        let deletedURL = await deleteURL(req.query.id, req.user._id, 'none', next);
        if(deletedURL) {
            res.status(204).json({
                status: 'deleted'
            });
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = userRouter;