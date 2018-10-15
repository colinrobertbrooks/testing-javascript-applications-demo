const { Access } = require('../../models');

const withAuth = wrapped => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }

  if (!req.user.access.includes('Admin')) {
    return res.sendStatus(403);
  }

  return wrapped.call(this, req, res, next);
};

module.exports = (() => {
  const list = async (req, res) => {
    try {
      const access = await Access.findAll({
        attributes: ['id', 'name']
      });

      return res.status(200).send(access);
    } catch (err) {
      return res.sendStatus(400);
    }
  };

  return {
    list: withAuth(list)
  };
})();
