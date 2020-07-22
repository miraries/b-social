const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const { models } = require('../db');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const morgan = require('morgan')
const helmet = require('helmet')
const { notFound, printStack } = require('./middleware/errorHandle')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(helmet());
// app.use(cors({ origin: process.env.CORS_ORIGIN}));

const jwt = async (payload, done) => {
    try {
        const user = await models.user.findById(payload.sub);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
};

app.use(passport.initialize());
passport.use('jwt', new JwtStrategy(jwtOptions, jwt));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;