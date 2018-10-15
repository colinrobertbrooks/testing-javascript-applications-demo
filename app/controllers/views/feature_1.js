module.exports = (() => {
  const get = (req, res) => {
    if (req.isAuthenticated() && req.user.access.includes('Feature 1')) {
      res.render('feature_1');
    } else {
      req.flash(
        'error',
        `You do not have permission to access the Feature 1 page.`
      );
      res.redirect('/');
    }
  };

  return {
    get
  };
})();
