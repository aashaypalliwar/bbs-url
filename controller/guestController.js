const { incrementUserURL, decrementUserURL, getAllSuborgInfo } = require('../model/businessLogic/userLogic');
const { protect } = require('../model/businessLogic/authLogic');
const { createNewShortURL, getURLsByUser, deleteURL } = require('../model/businessLogic/url/urlLogic');
const config = require('../utils/config');
// const sendEmail = require('./../utils/email');

const guestRouter = require('express').Router();


//Create a new short URL
guestRouter.post('/url', async (req,res,next) => {
    try{
        let urlInfo = {
            email: "guest@bbsurl.in",
            name: "Guest",
            userID: config.GUEST_USER_ID,
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
// userRouter.get('/url', async (req,res,next) => {
//     try{
//         let URLData = await getURLsByUser(req.user, "none", next);
//         if(URLData) {
//             res.status(200).json({
//                 URLData
//             });
//         }
//     }
//     catch(err){
//         next(err);
//     }
// });


//Delete a previously created short URL
guestRouter.delete('/url', async (req,res,next) => {
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

module.exports = guestRouter;
