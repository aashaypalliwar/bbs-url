const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Every URL must be related to an email"]
    },
    name: {
        type: String,
        required: [true, "Every URL must have a creator"]
    },
    userID: {
        type: String,
        default: "Guest"
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
    lastHitAt: {
        type: Date
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