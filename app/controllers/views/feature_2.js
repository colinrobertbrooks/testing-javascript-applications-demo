module.exports = (() => {
  const get = (req, res) => {
    if (req.isAuthenticated() && req.user.access.includes('Feature 2')) {
      res.render('feature_2');
    } else {
      req.flash(
        'error',
        `You do not have permission to access the Feature 2 page.`
      );
      res.redirect('/');
    }
  };

  return {
    get
  };
})();
