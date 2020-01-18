const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    suborg: {
        type: String,
        required: true,
        default : 'none'
    },
    shortURLEndPoint: {
        type: String,
        required: true
    },
    originalURL: {
        type: String,
        required: true
    },
    hits: {
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
