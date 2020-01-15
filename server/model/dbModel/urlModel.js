const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'User should have valid email address']
    },
    user: {
        type: String,
        required: [true, 'User should have a name.']
    },
    suborg: {
        type: String,
        required: [true, 'URL must belong to a particular org'],
        default : 'none'
    },
    shortURL: {
        type: String,
        required: [true, 'URL must be shortened']
    },
    originalURL: {
        type: String,
        required: [true, 'Original URL is necessary']
    },
    views: {
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

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
