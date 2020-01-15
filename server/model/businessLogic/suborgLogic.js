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
        let suborgInfo = await Suborg.find({'name': suborg.name}).lean();
        return suborgInfo;
    }
    catch(err){
        showError(err);
    }
};

// Create a new sub-organization
const createNewSuborg = async (suborgData) => {
    try{
        let newSubOrg = new Suborg(
            {
                'name' : suborgData.name,
                'description' : suborgData.description,
                'email': suborgData.email,
                'shortName': suborgData.shortName,
                'numberOfURLs': suborgData.numberOfURLs
            });
        suborgList = await Suborg.save();
        return suborgList;
    }
    catch(err){
        showError(err);
    }
};

// Update a given sub-organization
const updateSuborg = async (suborgData) => {
    try{
        let updatedSuborgInfo = await Suborg.findByIdAndUpdate(suborgData._id, {
            'name' : suborgData.name,
            'description' : suborgData.description,
            'email': suborgData.email,
            'shortName': suborgData.shortName
        }, {new: true});
        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Increment the URL count of the sub-org
const incrementSuborgURL = async (suborgData) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { name: suborgData.name},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});

        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Decrement the URL count of sub-org
const decrementSuborgURL = async (suborgData) => {
    try{
        let updatedSuborgInfo = await Suborg.findOneAndUpdate(
            { name: suborgData.name},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});

        return updatedSuborgInfo;
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
    decrementSuborgURL
};
