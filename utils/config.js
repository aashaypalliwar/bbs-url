// require('dotenv').config();

let PORT = process.env.PORT || 3002;
let EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
let EMAIL_PORT = process.env.EMAIL_PORT || 25;
let EMAIL_USERNAME = process.env.EMAIL_USERNAME || 'bbsurl.in@gmail.com';
let EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '8149842AAS';
let NODE_ENV = process.env.NODE_ENV || 'production';
let JWT_SECRET = process.env.JWT_SECRET || 'my-very-long-string-secret-super-strong-wohooo';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 100*100*60*1000;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 100*100*60*1000;
let VERIFICATION_STRING_LENGTH = process.env.VERIFICATION_STRING_LENGTH || 15;
let LINK_LENGTH = process.env.LINK_LENGTH || 6;

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
    EMAIL_PASSWORD,
    JWT_COOKIE_EXPIRES_IN,
    VERIFICATION_STRING_LENGTH,
    LINK_LENGTH
};
