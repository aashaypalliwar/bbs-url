const mongoose = require('mongoose');
const Suborg = require('../dbModel/suborgModel');
const AppError = require('../../utils/appError');

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

// Create a new sub-organization
const createNewSuborg = async (suborg, next) => {
    try{
        let newSubOrg = new Suborg(
            {
                'name' : suborg.name,
                'description' : suborg.description,
                'email': suborg.email,
                'shortName': suborg.shortName,
                'numberOfURLs': suborg.numberOfURLs
            });
        let suborgInfo = await newSubOrg.save();
        if(!suborgInfo)
            return next(new AppError("Failed to save.", 500));
        return suborgInfo;
    }
    catch(err){
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
            { _id: suborg._id},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});
        if(!updatedSuborgInfo)
            return next(new AppError("Failed to update.", 500));
        return updatedSuborgInfo;
    }
    catch(err){
        next(err);
    }
};

//Decrement the URL count of sub-org
const decrementSuborgURL = async (suborg, next) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { _id: suborg._id},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});
        if(!updatedSuborgInfo)
            return next(new AppError("Failed to update.", 500));
        return updatedSuborgInfo;
    }
    catch(err){
        next(err);
    }
};

//Delete a given sub-organization
const deleteSuborg = async (suborg, next) => {
    try{
        let deletedSuborg = await Suborg.deleteOne({ _id: suborg._id});
        if(!deletedSuborg)
            return next(new AppError("Failed to delete.", 500));
        console.log(`deleted file with id : ${suborg._id}`);
    }
    catch(err){
        next(err);
    }
};

module.exports = {
    //getAllSuborgs,
    //getSuborgInfo,
    //createNewSuborg,
    //updateSuborg,
    incrementSuborgURL,
    decrementSuborgURL,
    //deleteSuborg
};
