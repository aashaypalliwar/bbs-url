//require('dotenv').config();

let PORT = process.env.PORT || 3002;
let EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
let EMAIL_PORT = process.env.EMAIL_PORT || 25;
let EMAIL_USERNAME = process.env.EMAIL_USERNAME || '50a10f7fd880b1';
let EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'c3aa495fc71b0d';
let NODE_ENV = process.env.NODE_ENV || 'production';
let JWT_SECRET = process.env.JWT_SECRET || 'my-very-long-string-secret-super-strong-wohooo';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 100*60*1000;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avp10:mongoaashayp25@cluster0-fpk2z.mongodb.net/test?retryWrites=true&w=majority';

console.log(PORT);

module.exports = {
    PORT,
    MONGODB_URI,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PASSWORD
};
