const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Suborg = require('../dbModel/suborgModel');
const User = require('../dbModel/userModel');
const URL = require('../dbModel/urlModel');
const AppError = require('../../utils/appError');
const { isReserved } = require('./url/urlUtils');


// Get information about all the sub-organizations
const getAllSuborgs = async (next) => {
    try {
        let suborgList = await Suborg.find().lean();
        if(!suborgList)
            return next(new AppError("Something went wrong.", 500));
        return suborgList;
    }
    catch(err){
        next(err);
    }
};

// Get information about a given sub-organization
const getSuborgInfo = async (suborg, next) => {
    try {
        let suborgInfo = await Suborg.find({_id: suborg._id}).lean();
        if(!suborgInfo)
            return next(new AppError("Sub-Org not found.", 404));
        return suborgInfo;
    }
    catch(err){
        next(err);
    }
};


const suborgAlreadyExists = async (suborg) => {
    try{
        let count = await Suborg.countDocuments({ name: suborg }).lean();
        console.log(typeof count);
        if(count > 0)
            return 1;
        return 0;
    }
    catch (err) {
        showError(err);
    }
}

// Create a new sub-organization
const createNewSuborg = async (suborg, next) => {
    try{
        if(isReserved(suborg.name)){
            return next(new AppError("Requested sub-org name is reserved.", 400));
        }

        let alreadyExists = await suborgAlreadyExists(suborg.name);
        if(alreadyExists){
            return next(new AppError("Requested sub-org name already in use. Please use a different name.", 400));
        }
        let newSubOrg = new Suborg(
            {
                name : suborg.name,
                userID: suborg.userID,
                description : suborg.description,
                email: suborg.email,
                //'shortName': suborg.shortName,
                //'numberOfURLs': suborg.numberOfURLs
            });
        let suborgInfo = await newSubOrg.save();
        if(!suborgInfo){
            return next(new AppError("Failed to save.", 500));
        }else{
            //expect error
            let user = await User.findById({_id: new ObjectId(suborg.userID)}).lean();
            // console.log(user);
            // console.log(user.suborg);
            // console.log(typeof user.suborg);
            let suborgs = [...user.suborg, suborg.name];
            let detailSuborgInfo = [...user.suborgInfo, { name: suborg.name, description: suborg.description }]
            console.log(suborgs);
            let updatedUser = await User.updateOne({_id: suborg.userID}, {
                $set: {
                    suborg: suborgs,
                    suborgInfo: detailSuborgInfo
                }
            })
            // console.log(updatedUser);
            return suborgInfo;
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

// Update a given sub-organization
const updateSuborg = async (suborg, next) => {
    try{
        let updatedSuborgInfo = await Suborg.findByIdAndUpdate(suborg._id, {
            'name' : suborg.name,
            'description' : suborg.description,
            'email': suborg.email,
            'shortName': suborg.shortName
        }, {new: true});
        if(!updatedSuborgInfo)
            return next(new AppError("Failed to update.", 500));
        return updatedSuborgInfo;
    }
    catch(err){
        next(err);
    }
};

//Increment the URL count of the sub-org
const incrementSuborgURL = async (suborg, next) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { name: suborg},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});
        if(!updatedSuborgInfo)
            return next(new AppError("Failed to update.", 500));
        return updatedSuborgInfo;
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

//Decrement the URL count of sub-org
const decrementSuborgURL = async (suborg, next) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { name: suborg},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});
        if(!updatedSuborgInfo)
            return next(new AppError("Failed to update.", 500));
        return updatedSuborgInfo;
    }
    catch(err){
        return next(err);
    }
};

//Delete a given sub-organization
const deleteSuborg = async (suborg, next) => {
    try{
        console.log("hit1");
        let suborgToBeDeleted = await Suborg.findOne({ name: suborg.name});
        console.log(suborgToBeDeleted);
        let deletedSuborg = await Suborg.deleteOne({ name: suborg.name});
        console.log(deletedSuborg);
        if(!deletedSuborg)
            return next(new AppError("Failed to delete.", 500));
        console.log(`deleted file with name : ${suborg.name}`);
        if(deletedSuborg.deletedCount === 1) {
            //expect error
            let deleteURLs = await URL.deleteMany({suborg: suborg.name});
            let user = await User.findById({_id: new ObjectId(suborg.userID)});
            let suborgs = [...user.suborg];
            suborgs.splice(suborgs.indexOf(suborg.name), 1);
            console.log(suborgs);
            let detailSuborgInfo = [...user.suborgInfo];
            console.log("detailedsuborginfo");
            console.log(detailSuborgInfo);
            let index = detailSuborgInfo.findIndex((s) => {
                return s.name === suborg.name;
            })
            // console.log("index1", index1);
            // console.log("index2", index2);
            detailSuborgInfo.splice(index, 1)
            console.log("updation");
            console.log({ name: suborg.name, description: suborgToBeDeleted.description })
            console.log(suborgs);
            console.log(detailSuborgInfo);
            let updatedUser = await User.findOneAndUpdate({_id: suborg.userID}, {
                $set: {
                    suborg: suborgs,
                    suborgInfo: detailSuborgInfo              },
                $inc: { numberOfURLs: -1 * deleteURLs.deletedCount }
            })
            console.log("everything ok");
            return deletedSuborg;
        }
        else{
            return next(new AppError("Failed to delete.", 500));
        }
        return;
    }
    catch(err){
        next(err);
    }
};

// Get all URLs generated by a given suborg
const getURLsBySuborg = async (suborg, next) => {
    try {
        let urlList = await URL.find({suborg: suborg}).lean();
        if(!urlList)
            return next(new AppError("No suborg found with the given name", 404));
        return urlList;
    }
    catch(err){
        next(err);
    }
};

module.exports = {
    getAllSuborgs,
    getSuborgInfo,
    createNewSuborg,
    //updateSuborg,
    incrementSuborgURL,
    decrementSuborgURL,
    deleteSuborg,
    getURLsBySuborg
};
