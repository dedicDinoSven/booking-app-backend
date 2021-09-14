// Environment variables
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const db = require('./mongodb');

require('./middleware/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/property', require('./routes/property'));
app.use(
	'/reservation',
	passport.authenticate('jwt', { session: false }),
	require('./routes/reservation')
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
