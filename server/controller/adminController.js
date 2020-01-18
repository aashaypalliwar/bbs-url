const AppError = require('../utils/appError');
const config = require('../utils/config');
const { getAllUsers, getUserInfo, deleteUser, whitelistUser, blacklistUser } = require('../model/businessLogic/userLogic');
const { protect, restrictTo } = require('../model/businessLogic/authLogic');
const { getURLsByUser, whitelistURL, blacklistURL } = require('../model/businessLogic/url/urlLogic');
// const sendEmail = require('./../utils/email');

const adminRouter = require('express').Router();

adminRouter.use(protect, restrictTo('admin'));

// userRouter.post('/url', async (req,res,next) => {
//     try{
//         req.user.originalURL = req.body.originalURL;
//         let newURLData = await createNewShortURL(req.user);
//         res.status(200).json({
//             newURLData
//         });
//         await incrementUserURL(req.user._id);
//     }
//     catch(err){
//         next(err);
//     }
// });

// Get all the users
adminRouter.get('/users', async (req,res,next) => {
    try{
        let allUsers = await getAllUsers();
        res.status(200).json({
            allUsers
        });
    }
    catch(err){
        next(err);
    }
});

// Delete a given user
adminRouter.delete('/users', async (req,res,next) => {
    try{
        await deleteUser(req.body._id);
        res.status(204).json({
            status: 'deleted'
        });
    }
    catch(err){
        next(err);
    }
});

//Get details of a user and their URLS
adminRouter.get('/userDetails', async (req,res,next) => {
    try{
        let userDetails = await getUserInfo(req.body.email);
        let urlData = await getURLsByUser(userDetails._id);
        res.status(200).json({
            userDetails,
            urlData
        });
    }
    catch(err){
        next(err);
    }
});

//Blacklist or white list a given URL
adminRouter.put('/url', async (req,res,next) => {
    try{
        let urlData;
        if(req.body.blacklisted === 0)
            urlData = await whitelistURL(req.body._id);
        else
            urlData = await blacklistURL(req.body._id);
        res.status(200).json({
            urlData
        });
    }
    catch(err){
        next(err);
    }
});

//Blacklist or white list a given User
adminRouter.put('/users', async (req,res,next) => {
    try{
        let userData;
        if(req.body.blacklisted === 0)
            userData = await whitelistUser(req.body._id);
        else
            userData = await blacklistUser(req.body._id);
        res.status(200).json({
            userData
        });
    }
    catch(err){
        next(err);
    }
});





module.exports = adminRouter;
