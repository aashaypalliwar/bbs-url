//require('dotenv').config();

let PORT = process.env.PORT || 3002;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avp10:mongoaashayp25@cluster0-fpk2z.mongodb.net/test?retryWrites=true&w=majority';
console.log(PORT);

module.exports = {
    PORT,
    MONGODB_URI
};
