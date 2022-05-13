const User = require('../models/User.model');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser( async (id, done) => {
  try {
    const resFromDb = await User.findById(id).populate('posts');
    done(null, resFromDb);
  }
  catch(error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const resFromDb = await User.findOne({ username });
      if (resFromDb === null) {
          done(null, false, {
            message: 'Wrong Credentials' 
          });
      } else if (!bcrypt.compareSync(password, resFromDb.password)) {
          done(null, false, {
            message: 'Wrong Credentials'
          });
      } else {
          done(null, resFromDb);
      }
    }
    catch(error){
        done(error, false);
    }
  })
);

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
}