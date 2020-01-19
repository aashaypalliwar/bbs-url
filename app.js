const express = require('express');
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
const { generateEndpoint, alreadyExist, dnsCheck } = require('./model/businessLogic/url/urlUtils');
const { incrementURLHits } = require('./model/businessLogic/url/urlLogic');
const AppError = require('./utils/appError');

const app = express();

app.use(helmet());
app.use(cors());

//Rate limiter
let limit = 100;
if(config.NODE_ENV === 'development')
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
        let originalURL = await getRedirectURL(req.params.code, next);
        console.log(originalURL);
        if (originalURL) {
            res.status(301).redirect(originalURL);
            await incrementURLHits(req.params.code, next);
        }
    }
    catch(err){
        next(err);
    }
});

// Redirect for custom URL (sub-organizations)
app.get('/:suborg/:code', async (req,res,next)=>{
    try{
        let originalURL = await getRedirectURL(req.params.suborg+'/'+req.params.code, next);
        if(originalURL) {
            res.status(301).redirect(originalURL);
            await incrementURLHits(req.params.suborg+'/'+req.params.code, next);
        }
    }
    catch(err){
        next(err);
    }
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
