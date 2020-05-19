require('dotenv').config();

let PORT = process.env.PORT //|| 8080;
let EMAIL_HOST = process.env.EMAIL_HOST //|| 'smtp.mailtrap.io';
let EMAIL_PORT = process.env.EMAIL_PORT //|| 25;
let EMAIL_USERNAME = process.env.EMAIL_USERNAME ;
let EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ;
let NODE_ENV = process.env.NODE_ENV ;
let JWT_SECRET = process.env.JWT_SECRET ;
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
let MONGODB_URI = process.env.MONGODB_URI ;
let JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN ;
let VERIFICATION_STRING_LENGTH = process.env.VERIFICATION_STRING_LENGTH ;
let LINK_LENGTH = process.env.LINK_LENGTH ;
let GUEST_USER_ID = process.env.GUEST_USER_ID ;

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
    LINK_LENGTH,
    GUEST_USER_ID
};
