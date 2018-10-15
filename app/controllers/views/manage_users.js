module.exports = (() => {
  const get = (req, res) => {
    if (req.isAuthenticated() && req.user.access.includes('Admin')) {
      res.render('manage_users');
    } else {
      req.flash(
        'error',
        `You do not have permission to access the Manage Users page.`
      );
      res.redirect('/');
    }
  };

  return {
    get
  };
})();
