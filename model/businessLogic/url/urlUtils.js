const dns = require('dns');
let psl = require('psl');
const { promisify } = require('util');
const dnsLookup = promisify(dns.lookup);
const urlRegex = require('url-regex');
const generate = require('nanoid/generate');
const URL = require('../../dbModel/urlModel');
const config = require('../../../utils/config')

const reservedUrls = [
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
    "pricing",
    "aashay",
    "shreeya",
    "raja",
    "fida",
    "shivam",
    "himanshu",
    "palliwar",
    "tangadpalliwar",
    "neuro",
    "webd",
    "alma",
    "wiss",
    "esummit",
    "esum",
    "nakshatra",
    "gymkhana",
    "iitbbs",
    "mhr",
    "bhr",
    "ghr",
    "shr",
    "ses",
    "sif",
    "sms",
    "sbs",
    "lbc"
];

const alreadyExist = async (shortURLEndPoint) => {
    try{
        let count = await URL.countDocuments({ shortURLEndPoint: shortURLEndPoint }).lean();
        console.log(typeof count);
        if(count > 0)
            return 1;
        return 0;
    }
    catch (err) {
        showError(err);
    }
}

const isReserved = (shortURLEndPoint) => {
    return reservedUrls.includes(shortURLEndPoint);
}


const validateSuborgUrlUpdate = async (shortURLEndPoint ) => {
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
    let existsAlready = await alreadyExist(shortURLEndPoint);
    if(existsAlready)
        return 0;

    return 1;
};

let extractHostname = (url) => {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}

const dnsCheck = async (url) => {
    try{
        // const REPLACE_REGEX = /^https?:\/\//i
        // const domain = url.replace(REPLACE_REGEX, '');
        let domain = psl.get(extractHostname(url));
        let URLData = await dnsLookup(domain);
        if(URLData.address)
            return 1;
    }
    catch (err) {
        // if(err.errno === 'ENOTFOUND');
        console.log(err);
            return 0;
    }
}

const generateEndpoint = async () =>{
    const endpoint = await generate(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        Number(config.LINK_LENGTH) || 6
    );
    let existsAlready = await alreadyExist(endpoint)
    if (!existsAlready) return endpoint;
        return generateEndpoint();
}


module.exports = {
    reservedUrls,
    validateSuborgUrlUpdate,
    dnsCheck,
    generateEndpoint,
    alreadyExist,
    isReserved
}
