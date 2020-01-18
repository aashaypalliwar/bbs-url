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
const getUserInfo = async (email) => {
    try {
        let userInfo = await User.findOne({email: email}).select('+password');
        return userInfo;
    }
    catch(err){
        showError(err);
    }
};

// Create a new user
const createNewUser = async (user) => {
    try{
        let newUser = new User(
            {
                'name' : user.name,
                'password' : user.password,
                'passwordConfirm' : user.passwordConfirm,
                'email': user.email
            });
        let newUserInfo = await newUser.save();
        return newUserInfo;
    }
    catch(err){
        showError(err);
    }
};

// Update a given user info
const updateUser = async (user) => {
    try{
        let updatedUserInfo = await User.findByIdAndUpdate(user._id, {
            'name' : user.name,
            'blacklisted': user.blacklisted
        }, {new: true});
        return updatedUserInfo;
    }
    catch(err){
        showError(err);
    }
};

//Increment the URL count of a user
const incrementUserURL = async (id) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { _id: id},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});
        return updatedUserInfo;
    }
    catch(err){
        showError(err);
    }
};

//Decrement the URL count of a user
const decrementUserURL = async (user) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { _id: user._id},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});

        return updatedSuborgInfo;
    }
    catch(err){
        showError(err);
    }
};

//Delete a given user
const deleteUser = async (user) => {
    try{
        await User.deleteOne({ _id: user._id});
        console.log(`deleted user with id : ${user._id}`);
    }
    catch(err){
        showError(err);
    }
}

//update password

module.exports = {
    getAllUsers,
    getUserInfo,
    createNewUser,
    updateUser,
    incrementUserURL,
    decrementUserURL,
    deleteUser
};
