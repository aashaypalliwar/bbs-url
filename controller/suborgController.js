const { protect, restrictTo, checkSuborg } = require('../model/businessLogic/authLogic');
const { createNewSuborgURL, deleteURL } = require('../model/businessLogic/url/urlLogic');
const { incrementUserURL } = require('../model/businessLogic/userLogic');
const { incrementSuborgURL, decrementSuborgURL, createNewSuborg, deleteSuborg, getURLsBySuborg } = require('../model/businessLogic/suborgLogic');
// const sendEmail = require('./../utils/email');

const suborgRouter = require('express').Router();

suborgRouter.use(protect);

//Create a new suborg
suborgRouter.post('/', async (req,res,next) => {
    try {
        let subOrg = {
            name: req.body.suborgName,
            email: req.user.email,
            userID: req.user._id,
            description: req.body.description
        }

        let newSuborgData = await createNewSuborg(subOrg, next);
        if(newSuborgData){
            res.status(201).json({
                newSuborgData: newSuborgData
            });
        }

    }
    catch(err){
        next(err);
    }
});

//only valid sub-org must have power to deal with the same

suborgRouter.use(checkSuborg);

//Delete a suborg
suborgRouter.delete('/', async (req,res,next) => {
    try {
        let subOrg = {
            name: req.query.suborg,
            email: req.user.email,
            userID: req.user._id
        }
        console.log(subOrg);
        let newSuborgData = await deleteSuborg(subOrg, next);
        console.log(newSuborgData);
        if(newSuborgData){
            res.status(204).json({
                success: true,
                message: "Deleted successfully."
            });
        }

    }
    catch(err){
        next(err);
    }
});


//Get all suborg URL
suborgRouter.get('/', async (req,res,next) => {
    try{
        let URLData = await getURLsBySuborg(req.query.suborg, next);
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

//Create a new suborg URL
suborgRouter.post('/url', async (req,res,next) => {
    try {
        let urlInfo = {
            name: req.user.name,
            email: req.user.email,
            userID: req.user._id,
            suborg: req.body.suborgName,
            originalURL: req.body.originalURL,
            customURL: req.body.customURL,
            wantCustom: req.body.wantCustomURL
        }

        let newURLData = await createNewSuborgURL(urlInfo, next);
        if(newURLData){
            res.status(201).json({
                newURLData: newURLData
            });

        }

    }
    catch(err){
        console.log(err);
        next(err);
    }
});

//Delete a suborg URL
suborgRouter.delete('/url', async (req,res,next) => {
    try{
        let deletedURL = await deleteURL(req.query.id, req.user._id, req.query.suborg, next);
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



module.exports = suborgRouter;
