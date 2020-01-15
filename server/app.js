const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const middleware = require('./utils/middleware');
// const { promisify } = require('util');
// const dns =require('dns');
const validate = require('./controllers/validateURLController');
// const dnsLookup = promisify(dns.lookup);
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





app.get('/:id', async (req,res,next)=>{
    // res.status(307);
    // res.redirect('https://aashaypalliwar.github.io');
    // dnsLookup('http://google.com/').then( (err, addresses, family)=> {
    //         console.log(addresses);
    // }).catch(err => next(err));
    //console.log(validate.dnsCheck('google.com'));

});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
