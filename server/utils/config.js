//require('dotenv').config();

let PORT = process.env.PORT || 3002;
let NODE_ENV = process.env.NODE_ENV || 'dev';
let JWT_SECRET = process.env.JWT_SECRET || 'my-very-long-string-secret-super-strong-wohooo';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 100*60*1000;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avp10:mongoaashayp25@cluster0-fpk2z.mongodb.net/test?retryWrites=true&w=majority';
console.log(PORT);

module.exports = {
    PORT,
    MONGODB_URI,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN
};
