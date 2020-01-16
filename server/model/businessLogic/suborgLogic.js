const mongoose = require('mongoose');
const Suborg = require('../dbModel/suborgModel');
const showError = require('../../utils/middleware').showError;

// Get information about all the sub-organizations
const getAllSuborgs = async () => {
    try {
        let suborgList = await Suborg.find().lean();
        return suborgList;
    }
    catch(err){
        showError(err);
    }
};

// Get information about a given sub-organization
const getSuborgInfo = async (suborg) => {
    try {
        let suborgInfo = await Suborg.find({_id: suborg._id}).lean();
        return suborgInfo;
    }
    catch(err){
        showError(err);
    }
};

// Create a new sub-organization
const createNewSuborg = async (suborg) => {
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
        return suborgInfo;
    }
    catch(err){
        showError(err);
    }
};

// Update a given sub-organization
const updateSuborg = async (suborg) => {
    try{
        let updatedSuborgInfo = await Suborg.findByIdAndUpdate(suborg._id, {
            'name' : suborg.name,
            'description' : suborg.description,
            'email': suborg.email,
            'shortName': suborg.shortName
        }, {new: true});
        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Increment the URL count of the sub-org
const incrementSuborgURL = async (suborg) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { _id: suborg._id},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});

        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Decrement the URL count of sub-org
const decrementSuborgURL = async (suborg) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { _id: suborg._id},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});

        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Delete a given sub-organization
const deleteSuborg = async (suborg) => {
    try{
         await Suborg.deleteOne({ _id: suborg._id});
         console.log(`deleted file with id : ${suborg._id}`);
    }
    catch(err){
        showError(err);
    }
};

module.exports = {
    getAllSuborgs,
    getSuborgInfo,
    createNewSuborg,
    updateSuborg,
    incrementSuborgURL,
    decrementSuborgURL,
    deleteSuborg
};
