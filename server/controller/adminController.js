const { getAllUsers, getUserInfo, deleteUser, whitelistUser, blacklistUser } = require('../model/businessLogic/userLogic');
const { protect, restrictTo } = require('../model/businessLogic/authLogic');
const { getURLsByUser, whitelistURL, blacklistURL } = require('../model/businessLogic/url/urlLogic');
// const sendEmail = require('./../utils/email');

const adminRouter = require('express').Router();

adminRouter.use(protect, restrictTo('admin'));

// Get all the users
adminRouter.get('/users', async (req,res,next) => {
    try{
        let allUsers = await getAllUsers(next);
        if(allUsers) {
            res.status(200).json({
                allUsers
            });
        }
    }
    catch(err){
        next(err);
    }
});

// Get all suborgs
adminRouter.get('/suborgs', async (req,res,next) => {
    try{
        let allSuborgs = await getAllUsers(next, 'suborg');
        if(allSuborgs) {
            res.status(200).json({
                allSuborgs
            });
        }
    }
    catch(err){
        next(err);
    }
});

// Delete a given user
adminRouter.delete('/users', async (req,res,next) => {
    try{
        let deletedUser = await deleteUser(req.body._id, next);
        if(deletedUser) {
            res.status(204).json({
                status: 'deleted'
            });
        }
    }
    catch(err){
        next(err);
    }
});

//Get details of a user and their URLS
adminRouter.get('/userInfo', async (req,res,next) => {
    try{
        let userDetails = await getUserInfo(req.body.email, next);
        if(userDetails) {
            let urlData = await getURLsByUser(userDetails._id, next);
            if(urlData) {
                res.status(200).json({
                    userDetails,
                    urlData
                });
            }
        }
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
            urlData = await whitelistURL(req.body._id, next);
        else
            urlData = await blacklistURL(req.body._id, next);
        if(urlData) {
            res.status(200).json({
                urlData
            });
        }
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
            userData = await whitelistUser(req.body._id, next);
        else
            userData = await blacklistUser(req.body._id, next);
        if(userData) {
            res.status(200).json({
                userData
            });
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = adminRouter;
