const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const middleware = require('./utils/middleware');
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


// 1. api


// 2. redirect block





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
