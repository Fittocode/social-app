const express = require('express');
require('dotenv/config');
const app = express();

//middleware config
require('./config/index')(app);

// passport authentication
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User.models');

app.use(flash());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24,
    }),
  })
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  try {
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      const user = await User.findOne({ username });
      try {
        if (!user) {
          return done(null, false, {
            message: 'Incorrect Username',
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: 'Incorrect password',
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
app.use(passport.initialize());
app.use(passport.session());

// connect to MongoDB
const connectDB = require('./db/index');
connectDB();

// Routes
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

// local host 3000 listening
app.listen(3000, () => {
  console.log('listening...');
});
