const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const rateLimit = require('express-rate-limit');

const middleware = require('./utils/middleware');
const { getRedirectURL } = require('./model/businessLogic/url/urlLogic');
const config = require('./utils/config');
const apiRouter = require('./controller/apiController');
const { clientEndpoints } = require('./model/businessLogic/url/urlUtils');
const { incrementURLHits } = require('./model/businessLogic/url/urlLogic');
const AppError = require('./utils/appError');

const app = express();

app.use(helmet());
app.use(cors());

//Rate limiter
let limit = 20;
if(config.NODE_ENV === 'development')
    limit = 1000;
const limiter = rateLimit({
    max: limit,
    windowMs: 5 * 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again after a few hours!'
});

const authLimiter = rateLimit({
    max: 10,
    windowMs: 10 * 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again after some hours!'
});

const guestLimiter = rateLimit({
    max: 15,
    windowMs: 5 * 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again after some hours!'
});

app.use('/api/user', limiter);
app.use('/api/suborg', limiter);
app.use('/api/auth', authLimiter);
app.use('/api/guest', guestLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
app.use(cookieParser());

app.use(middleware.requestLogger);

// http://bbsurl.in/.well-known/pki-validation/9CCD23DD8E558AD728D095392BF16134.txt
// app.get('/.well-known/pki-validation/1DBDD4603921F01E48CE4C5D5DDAE51B.txt', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '/.well-known/pki-validation/1DBDD4603921F01E48CE4C5D5DDAE51B.txt'));
// })

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/:clientEndpoint', (req, res, next) => {
    if(clientEndpoints.includes(req.params.clientEndpoint)){
        res.sendFile(path.join(__dirname, '/client/build/index.html'));
    }else{
        next();
    }
})

// CRUD handler
app.use('/api', apiRouter);

// General redirect
app.get('/:code', async (req,res,next)=>{
    try {
        let originalURL = await getRedirectURL(req.params.code, next);
        console.log(originalURL);
        if(originalURL === undefined){
            res.status(301).redirect('/');
        }
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
        if(originalURL === undefined){
            res.status(301).redirect('/');
        }
        if(originalURL) {
            res.status(301).redirect(originalURL);
            await incrementURLHits(req.params.suborg+'/'+req.params.code, next);
        }
    }
    catch(err){
        next(err);
    }
});

app.get('*', (req, res) => {
    res.status(301).redirect('/');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
