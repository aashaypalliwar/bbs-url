const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'User should have valid email address']
    },
    name: {
        type: String,
        required: [true, 'User should have a name.']
    },
    password: {
        type: String,
        required: [true, 'URL must belong to a particular org'],  ///////////check
    },
    numberOfURLs: {
        type: Number,
        default : 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    blacklisted: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
