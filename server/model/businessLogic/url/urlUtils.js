const dns = require('dns');
const { promisify } = require('util');
const dnsLookup = promisify(dns.lookup);
const urlRegex = require('url-regex');
const generate = require('nanoid/generate');
const URL = require('../../dbModel/urlModel');

const preservedUrls = [
    "login",
    "logout",
    "signup",
    "reset-password",
    "resetpassword",
    "url-password",
    "url-info",
    "settings",
    "stats",
    "verify",
    "api",
    "404",
    "static",
    "images",
    "banned",
    "terms",
    "privacy",
    "report",
    "pricing"
];

const alreadyExist = async (shortURLEndPoint) => {
    try{
        let count = await URL.countDocuments({ shortURLEndPoint: shortURLEndPoint }).lean();
        if(count > 0)
            return 1;
        return 0;
    }
    catch (err) {
        showError(err);
    }
}

const validateSuborgUrlUpdate = async (suborg, shortURLEndPoint ) => {
    // Validate URL existence
    if (!shortURLEndPoint)
        return 0;

    // validate URL length
    if (shortURLEndPoint.length > 64) {
        return 0;
    }

    // Validate URL
    const isValidUrl = urlRegex({ exact: true, strict: false }).test(
        `${process.env.DEFAULT_DOMAIN}/${shortURLEndPoint}`
    );
    if (!isValidUrl)
        return 0;

    // Check if already exist
    if(alreadyExist(shortURLEndPoint))
        return 0;

    return 1;
};

const dnsCheck = async (url) => {
    try{
        let URLData = await dnsLookup(url);
        if(URLData.address)
            return 1;
    }
    catch (err) {
        // if(err.errno === 'ENOTFOUND');
            return 0;
    }
}

const generateEndpoint = async () =>{
    const endpoint = generate(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        Number(process.env.LINK_LENGTH) || 6
    );
    if (!alreadyExist(endpoint)) return endpoint;
    return generateEndpoint();
}


module.exports = {
    preservedUrls,
    validateSuborgUrlUpdate,
    dnsCheck,
    generateEndpoint,
    alreadyExist
}
