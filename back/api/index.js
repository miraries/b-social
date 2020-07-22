const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth.routes');
const { models } = require('../db');
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const tokenRevoked = require('./middleware/tokenRevoked')
const morgan = require('morgan')
const helmet = require('helmet')
const strategyFactory = require('./common/passport')
const { notFound, printStack } = require('./middleware/errorHandle')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(helmet());
// app.use(cors({ origin: process.env.CORS_ORIGIN}));

app.use(passport.initialize());
passport.use('jwt', strategyFactory());
app.use(tokenRevoked);

app.use('/api/auth', auth);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);

app.use(notFound)
app.use(printStack)

module.exports = app;