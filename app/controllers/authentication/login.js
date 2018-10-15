module.exports = passport => {
  const get = (req, res) => {
    if (req.user) {
      req.flash('warning', "You're already logged in.");
      res.redirect('/');
    } else {
      res.render('login');
    }
  };

  const post = passport.authenticate('local', {
    successRedirect: '/',
    successFlash: 'Logged in successfully.',
    failureRedirect: '/login',
    failureFlash: 'Invalid username and/or password.'
  });

  return {
    get,
    post
  };
};
