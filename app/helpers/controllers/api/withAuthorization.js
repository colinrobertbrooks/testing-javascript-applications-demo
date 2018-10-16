const withAuthorization = ({ wrappedMethod, accessName }) => (
  req,
  res,
  next
) => {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }

  if (!req.user.access.includes(accessName)) {
    return res.sendStatus(403);
  }

  return wrappedMethod.call(this, req, res, next);
};

module.exports = withAuthorization;
