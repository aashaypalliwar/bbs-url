const mongoose = require('mongoose');
const User = require('../dbModel/userModel');
const showError = require('../../utils/middleware').showError;

// Get information about all the users
const getAllUsers = async () => {
    try {
        let userList = await User.find().lean();
        return userList;
    }
    catch(err){
        showError(err);
    }
};

// Get information about a given user
const getUserInfo = async (user) => {
    try {
        let userInfo = await User.find({'name': user.name}).lean();
        return userInfo;
    }
    catch(err){
        showError(err);
    }
};

// Create a new user
const createNewUser = async (userData) => {
    try{
        let newUser = new User(
            {
                'name' : userData.name,
                'password' : userData.password,
                'email': user.email
            });
        let newUserData = await User.save();
        return newUserData;
    }
    catch(err){
        showError(err);
    }
};

// Update a given user info
const updateUser = async (userData) => {
    try{
        let updatedUserInfo = await User.findByIdAndUpdate(userData._id, {
            'name' : userData.name,
            'blacklisted': userData.blacklisted
        }, {new: true});
        return updatedUserInfo;
    }
    catch(err){
        showError(err);
    }
};

//Increment the URL count of a user
const incrementUserURL = async (userData) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { name: userData.name},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});
        return updatedUserInfo;
    }
    catch(err){
        showError(err);
    }
};

//Decrement the URL count of a user
const decrementUserURL = async (userData) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { name: userData.name},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});

        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//update password

module.exports = {
    getAllUsers,
    getUserInfo,
    createNewUser,
    updateUser,
    incrementUserURL,
    decrementUserURL
};
