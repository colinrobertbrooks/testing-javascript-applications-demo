const get = (req, res) => {
  if (req.user) {
    req.logout();
    req.flash('success', 'Logged out successfully.');
  } else {
    req.flash('error', 'No user to log out.');
  }

  res.redirect('/');
};

module.exports = {
  get
};
