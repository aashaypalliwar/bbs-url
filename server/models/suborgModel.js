const mongoose = require('mongoose');

const suborgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sub-org should have a name.']
    },
    description: {
        type: String,
        required: true
    },
    shortName: {
      type: String,
      required: true
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

const Suborg = mongoose.model('Suborg', suborgSchema);

module.exports = Suborg;
