const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const middleware = require('./utils/middleware');


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

app.get('/aashay',(req,res)=>{
    res.status(307);
    res.redirect('https://aashaypalliwar.github.io');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
