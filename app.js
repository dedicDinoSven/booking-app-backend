// Environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Connect to MongoDB
const db = process.env.MONGO_URI;
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
mongoose.set("useCreateIndex", true);

require('./config/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use(
  '/secure',
  passport.authenticate('jwt', { session: false }),
  require('./routes/secureRoutes')
);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
