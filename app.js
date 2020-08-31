const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

const middleware = require('./utils/middleware');
const { getRedirectURL } = require('./model/businessLogic/url/urlLogic');
const apiRouter = require('./controller/apiController');
const { clientEndpoints } = require('./model/businessLogic/url/urlUtils');
const { incrementURLHits } = require('./model/businessLogic/url/urlLogic');
const {limiter, guestLimiter, authLimiter} = require('./utils/limiters');

const app = express();

app.use(helmet());
app.use(cors());

//Rate limiter
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

// General Redirect
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