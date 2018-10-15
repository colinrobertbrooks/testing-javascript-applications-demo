const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User, Access } = require('../models');
const passwordHelper = require('../helpers/authentication/password');

passport.use(
  new LocalStrategy((username, password, callback) =>
    User.findOne({
      attributes: ['username', 'password', 'salt'],
      where: {
        username
      }
    }).then(user => {
      if (!user) {
        return callback(null, false);
      }

      const { password: hash, salt } = user;

      return passwordHelper.validate(hash, salt, password).then(isValid => {
        if (!isValid) {
          return callback(null, false);
        }

        return callback(null, user);
      });
    })
  )
);

passport.serializeUser((user, callback) => callback(null, user.username));

passport.deserializeUser((username, callback) =>
  User.findOne({
    attributes: ['username'],
    where: {
      username
    },
    include: [Access]
  }).then(user => {
    if (!user) {
      return callback(null, false);
    }

    return callback(null, user.mapAccessBy('name'));
  })
);
