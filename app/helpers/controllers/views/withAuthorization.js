const withAuthorization = ({ wrappedMethod, accessName, viewName }) => (
  req,
  res,
  next
) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You are not logged in.');
    res.redirect('/login');
  } else if (!req.user.access.includes(accessName)) {
    req.flash('error', `You are not authorized to access ${viewName}.`);
    res.redirect('/');
  } else {
    wrappedMethod.call(this, req, res, next);
  }
};

module.exports = withAuthorization;
