const User = require('../dbModel/userModel');
const URL = require('../dbModel/urlModel')
const AppError = require('../../utils/appError')

// Get information about all the users
const getAllUsers = async (next, role='user') => {
    try {
        let userList = await User.find({role: role}).lean();
        if(!userList)
            return next(new AppError("Something went wrong Try Again.", 404));
        return userList;
    }
    catch(err){
        next(err);
    }
};

// Get information about a given user
const getUserInfo = async (email, next) => {
    try {
        let userInfo = await User.findOne({email: email}).select('+password');
        if(!userInfo)
            return next(new AppError("User not found.", 404));
        return userInfo;
    }
    catch(err){
        next(err);
    }
};

// Create a new user
const createNewUser = async (user, req,next) => {
    try{
        let newUser = new User(
            {
                'name' : user.name,
                'password' : user.password,
                'passwordConfirm' : user.passwordConfirm,
                'email': user.email,
                'ip': req.headers['x-forwarded-for'],
                'ip2': req.connection.remoteAddress
            });
        let newUserInfo = await newUser.save();
        if(!newUserInfo)
            return next(new AppError("Save failed. Please try again", 500));
        return newUserInfo;
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

// Update a given user info
const updateUser = async (user, next) => {
    try{
        let updatedUserInfo = await User.findByIdAndUpdate(user._id, {
            'name' : user.name,
            'blacklisted': user.blacklisted
        }, {new: true});
        if(!updatedUserInfo)
            return next(new AppError("Failed to update. Please try again.", 500));
        return updatedUserInfo;
    }
    catch(err){
       return next(err);
    }
};

//Increment the URL count of a user
const incrementUserURL = async (id, next) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { _id: id},
            { $inc: { numberOfURLs: 1 }  },
            {new: true});
        if(!updatedUserInfo)
            return next(new AppError("Failed to update counter. Please try again.", 500));
        return updatedUserInfo;
    }
    catch(err){
        console.log(err);
       return next(err);
    }
};

//Decrement the URL count of a user
const decrementUserURL = async (id, next) => {
    try{
        let updatedUserInfo = await User.findOneAndUpdate(
            { _id: id},
            { $inc: { numberOfURLs: -1 }  },
            {new: true});
        if(!updatedUserInfo)
            return next(new AppError("Failed to update counter. Please try again.", 500));
        return updatedUserInfo;
    }
    catch(err){
        return next(err);
    }
};

//Delete a given user
const deleteUser = async (id, next) => {
    try{
        let deletedURls = await URL.deleteMany({userID : id});
        if(!deletedURls)
            return next(new AppError("Failed to delete Users URLs first. Please try deleting the user again.", 500));
        let deletedUser = await User.deleteOne({ _id: id});
        if(!deletedUser)
            return next(new AppError("Failed to delete the user. Please try deleting the user again.", 500));
        console.log(`deleted user with id : ${id}`);
    }
    catch(err){
        next(err);
    }
}

//Blacklist a user
const blacklistUser = async (id, next) => {
    try{
        let updatedUserInfo = await User.findByIdAndUpdate(id, {
            blacklisted: true
        }, {new : true});
        await URL.updateMany({userID: id}, {
            blacklisted: true
        });
        if(!updatedUserInfo)
            return next(new AppError("Failed to update user. Please try again.", 500));
        return updatedUserInfo;
    }
    catch (err) {
        next(err);
    }
}

// Whitelist a User
const whitelistUser = async (id, next) => {
    try{
        let updatedUserInfo = await User.findByIdAndUpdate(id, {
            blacklisted: false
        }, {new : true});
        await URL.updateMany({userID: id}, {
            blacklisted: false
        });
        if(!updatedUserInfo)
            return next(new AppError("Failed to update user. Please try again.", 500));
        return updatedUserInfo;
    }
    catch (err) {
        next(err);
    }
}

//get all suborgs of a user
const getAllSuborgInfo = async (email, next) => {
    try {
        let user = await User.find({email: email}).lean();
        if(!user)
            return next(new AppError("User not found.", 404));
        return user.suborgInfo;
    }
    catch(err){
        next(err);
    }
};


module.exports = {
    getAllUsers,
    getUserInfo,
    createNewUser,
    updateUser,
    incrementUserURL,
    decrementUserURL,
    deleteUser,
    whitelistUser,
    blacklistUser,
    getAllSuborgInfo
};
