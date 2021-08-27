require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const friendRequestRouter = require('./routes/friendRequests');
const imageRouter = require('./routes/imageUpload');

var app = express();

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); };
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      };
      bcrypt.compare(password, user.password, function (err, res) {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        };
      });
    });
  }
));

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
}, function (jwtPayload, cb) {
    return cb(null, jwtPayload.user);
   }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(cors());
app.use(compression());
app.use(helmet());

app.use('/', indexRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);
app.use('/friendRequests', passport.authenticate('jwt', { session: false }), friendRequestRouter);
app.use('/imageUpload', passport.authenticate('jwt', { session: false }), imageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// want to limit cors to only my frontend domain