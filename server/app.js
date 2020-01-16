const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const middleware = require('./utils/middleware');
const getRedirectURL = require('./model/businessLogic/url/urlLogic').getRedirectURL;



const { promisify } = require('util');
const dns =require('dns');
const dnsLookup = promisify(dns.lookup);
const generateEndpoint = require('./model/businessLogic/url/urlUtils').generateEndpoint;
const alreadyExist = require('./model/businessLogic/url/urlUtils').alreadyExist;
const dnsCheck = require('./model/businessLogic/url/urlUtils').dnsCheck;
const validateSuborgUrlUpdate = require('./model/businessLogic/url/urlUtils').validateSuborgUrlUpdate;

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//check usage
app.use(cookieParser());
app.use(passport.initialize());
//change
app.use(express.static("static"));
app.use(middleware.requestLogger);


// CRUD handler


// General redirect
app.get('/:code', async (req,res,next)=>{
    try{
        let { shortURLEndPoint, originalURL } = await getRedirectURL(req.params.code);
        if(originalURL !== null)
            res.redirect(originalURL);
        else
            res.sendStatus(404);
    }
    catch(err){
        next(err);
    }
});

// Redirect for custom URL (sub-organizations)
app.get('/:suborg/:code', async (req,res,next)=>{
    try{
        let { shortURLEndPoint, originalURL } = await getRedirectURL(req.params.suborg+'/'+req.params.code);
        console.log(req.params.suborg+'/'+req.params.code);
        if(originalURL !== null)
            res.redirect(originalURL);
        else
            res.sendStatus(404);
    }
    catch(err){
        next(err);
    }
});





app.get('/123', async (req,res,next)=>{
    try{
        let endpoint = 'f758dd';
        let result = await validateSuborgUrlUpdate(endpoint);
        console.log(result)
        res.json(result);
    }
    catch(err){
        next(err);
    }

});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
