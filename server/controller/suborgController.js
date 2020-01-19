const { protect, restrictTo } = require('../model/businessLogic/authLogic');
const { createNewSuborgURL } = require('../model/businessLogic/url/urlLogic');
const { incrementUserURL } = require('../model/businessLogic/userLogic');
// const sendEmail = require('./../utils/email');

const suborgRouter = require('express').Router();

suborgRouter.use(protect, restrictTo('suborg'));

//Create a new suborg URL
suborgRouter.post('/url', async (req,res,next) => {
    try {
        let urlObj = {
            name: req.user.name,
            email: req.user.email,
            _id: req.user._id,
            suborg: req.user.suborg,
            role: req.user.role,
            originalURL: req.body.originalURL,
            customURL: req.body.customURL,
            wishCustom: req.body.wishCustom
        }

        let newURLdata = await createNewSuborgURL(urlObj, next);
        if(newURLdata){
            res.status(200).json({
                newURLData: newURLdata
            });
            await incrementUserURL(req.user._id, next);
        }

    }
    catch(err){
        next(err);
    }
});

module.exports = suborgRouter;
