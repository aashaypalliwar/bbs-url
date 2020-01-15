const dns = require('dns');
const { promisify } = require('util');
const URL = require('url');
const urlRegex = require('url-regex');

//const dnsLookup = promisify(dns.lookup);
// const dnsCheck = async (domain) => {
//     const dnsres = await dns.lookup('google.com');
//     if(dnsres.errno){
//         console.log(err);
//         return 0;
//     }
//     console.log(dnsres);
//     return 1;
// };

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

const validateUrl = async (req, res, next) => {
    // Validate URL existence
    if (!req.body.target)
        return res.status(400).json({ error: "No target has been provided." });

    // validate URL length
    if (req.body.target.length > 2040) {
        return res.status(400).json({ error: "Maximum URL length is 2040." });
    }

    // Validate URL
    const isValidUrl = urlRegex({ exact: true, strict: false }).test(
        req.body.target
    );
    if (!isValidUrl && !/^\w+:\/\//.test(req.body.target))
        return res.status(400).json({ error: "URL is not valid." });

    // // If target is the URL shortener itself
    // const { host } = URL.parse(addProtocol(req.body.target));
    // if (host === process.env.DEFAULT_DOMAIN) {
    //     return res
    //         .status(400)
    //         .json({ error: `${process.env.DEFAULT_DOMAIN} URLs are not allowed.` });
    // }
    //check

    // Validate password length
    if (req.body.password && req.body.password.length > 64) {
        return res.status(400).json({ error: "Maximum password length is 64." });
    }

    // // Custom URL validations
    // if (req.user && req.body.customurl) {
    //     // Validate custom URL
    //     if (!/^[a-zA-Z0-9-_]+$/g.test(req.body.customurl.trim())) {
    //         return res.status(400).json({ error: "Custom URL is not valid." });
    //     }
    //
    //     // Prevent from using preserved URLs
    //     if (preservedUrls.some(url => url === req.body.customurl)) {
    //         return res
    //             .status(400)
    //             .json({ error: "You can't use this custom URL name." });
    //     }
    //
    //     // Validate custom URL length
    //     if (req.body.customurl.length > 64) {
    //         return res
    //             .status(400)
    //             .json({ error: "Maximum custom URL length is 64." });
    //     }
    // }

    return next();
};


module.exports = {
    preservedUrls,
    validateUrl
}
