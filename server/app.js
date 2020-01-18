const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const middleware = require('./utils/middleware');
const { getRedirectURL } = require('./model/businessLogic/url/urlLogic');
const config = require('./utils/config');
const apiRouter = require('./controller/apiController');



const { promisify } = require('util');
const dns =require('dns');
const dnsLookup = promisify(dns.lookup);
const generateEndpoint = require('./model/businessLogic/url/urlUtils').generateEndpoint;
const alreadyExist = require('./model/businessLogic/url/urlUtils').alreadyExist;
const dnsCheck = require('./model/businessLogic/url/urlUtils').dnsCheck;
const validateSuborgUrlUpdate = require('./model/businessLogic/url/urlUtils').validateSuborgUrlUpdate;
const { incrementURLHits } = require('./model/businessLogic/url/urlLogic');

const app = express();

app.use(helmet());
app.use(cors());

//Rate limiter
let limit = 100;
if(config.NODE_ENV === 'dev')
    limit = 1000;
const limiter = rateLimit({
    max: limit,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//     hpp({
//         whitelist: [
//             'duration',
//             'ratingsQuantity',
//             'ratingsAverage',
//             'maxGroupSize',
//             'difficulty',
//             'price'
//         ]
//     })
// );

app.use(cookieParser());
//change
app.use(express.static("static"));
app.use(middleware.requestLogger);


// CRUD handler
app.use('/api', apiRouter);

// General redirect
app.get('/:code', async (req,res,next)=>{
    try {
        let {shortURLEndPoint, originalURL} = await getRedirectURL(req.params.code);
        if (originalURL !== null) {
            await incrementURLHits(req.params.code);
            res.status(301).redirect(originalURL);
        }
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
        if(originalURL !== null) {
            await incrementURLHits(req.params.code);
            res.status(301).redirect(originalURL);
        }
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
