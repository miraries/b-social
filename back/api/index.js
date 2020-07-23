const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth.routes');
const posts = require('./routes/posts.routes');
const comments = require('./routes/comments.routes');
const user = require('./routes/user.routes');
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

app.use('/api/auth', auth);
app.use('/api/posts', passportMiddleware, posts);

// Use use same route since these are subroutes
app.use('/api/posts', passportMiddleware, comments);
app.use('/api/users', passportMiddleware, user);

app.use(notFound)
app.use(printStack)

module.exports = app;