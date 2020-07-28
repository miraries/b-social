const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const auth = require('./routes/auth.routes');
const posts = require('./routes/posts.routes');
const comments = require('./routes/comments.routes');
const user = require('./routes/users.routes');
const passport = require('passport');
const tokenRevoked = require('./middleware/tokenRevoked')
const morgan = require('morgan')
const helmet = require('helmet')
const strategyFactory = require('./common/passport')
const { notFound, printStack } = require('./middleware/errorHandle')

const app = express();
const passportMiddleware = passport.authenticate('jwt', {session: false});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(helmet());
// app.use(cors({ origin: process.env.CORS_ORIGIN}));

app.use(passport.initialize());
passport.use('jwt', strategyFactory());
app.use(tokenRevoked);

app.get('/api', (req, res) => res.json({ok: true}));
app.use('/api/auth', auth);
app.use('/api/posts', passportMiddleware, posts);
app.use('/api/users', passportMiddleware, user);

// Subroutes
app.use('/api/', passportMiddleware, comments);

app.use(notFound)
app.use(printStack)

module.exports = app;