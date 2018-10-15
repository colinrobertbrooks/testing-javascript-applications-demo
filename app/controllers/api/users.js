/* eslint-disable consistent-return */
const { ValidationError, ValidationErrorItem } = require('sequelize');

const { User, Access } = require('../../models');
const passwordHelper = require('../../helpers/authentication/password');

const withAuth = wrapped => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }

  if (!req.user.access.includes('Admin')) {
    return res.sendStatus(403);
  }

  return wrapped.call(this, req, res, next);
};

const userExistsWithId = async id => {
  const user = await User.findById(id);

  if (user) {
    return true;
  }

  return false;
};

const validateAccess = async ids => {
  const validIds = await Access.findAll({
    attributes: ['id']
  }).map(({ dataValues }) => dataValues.id);

  const idsAreValid = ids.every(id => validIds.includes(id));

  if (ids.length < 1 || !idsAreValid) {
    throw new ValidationError(null, [
      new ValidationErrorItem('Validation on access failed', 'Validation error')
    ]);
  }
};

const validatePassword = password => {
  if (!password || !/^\S*$/.test(password)) {
    throw new ValidationError(null, [
      new ValidationErrorItem(
        'Validation on password failed',
        'Validation error'
      )
    ]);
  }
};

const handleValidationErrors = (errors, res) => {
  if (errors.every(e => e.type === 'Validation error')) {
    return res.status(422).json({ errors: errors.map(error => error.message) });
  }
};

const handleUniqueViolation = (errors, res) => {
  const uniqueViolation = errors.find(
    error => error.type === 'unique violation'
  );

  if (uniqueViolation) {
    return res
      .status(409)
      .send(`User already exists with ${uniqueViolation.path}.`);
  }
};

module.exports = (() => {
  const list = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username'],
        include: [Access]
      });

      return res.status(200).send(users.map(user => user.mapAccessBy('id')));
    } catch (err) {
      return res.sendStatus(400);
    }
  };

  const create = async (req, res) => {
    try {
      const { access: accessIds, password, ...restAttributes } = req.body;

      await validateAccess(accessIds);
      validatePassword(password);

      const { hash, salt } = await passwordHelper.encrypt(password);
      const newUser = await User.create({
        ...restAttributes,
        password: hash,
        salt
      });

      await newUser.addAccesses(accessIds);

      return res.sendStatus(201);
    } catch (err) {
      if (err instanceof ValidationError) {
        handleValidationErrors(err.errors, res);
        handleUniqueViolation(err.errors, res);
      }

      return res.sendStatus(400);
    }
  };

  const update = async (req, res) => {
    const { id: userId } = req.params;

    try {
      const { access: accessIds, password, ...restAttributes } = req.body;

      await validateAccess(accessIds);

      let newHash;
      let newSalt;

      if (password) {
        validatePassword(password);

        ({ hash: newHash, salt: newSalt } = await passwordHelper.encrypt(
          password
        ));
      }

      const usersUpdated = await User.update(
        {
          ...restAttributes,
          ...(password && { password: newHash }),
          ...(password && { salt: newSalt })
        },
        {
          where: { id: userId },
          limit: 1
        }
      );

      if (usersUpdated[0]) {
        const updatedUser = await User.findById(userId);

        await updatedUser.setAccesses(accessIds);

        return res.sendStatus(200);
      }

      throw new Error(`Unable to update user ${userId}.`);
    } catch (err) {
      const userExists = await userExistsWithId(userId);

      if (!userExists) {
        return res.sendStatus(404);
      }

      if (err instanceof ValidationError) {
        handleValidationErrors(err.errors, res);
        handleUniqueViolation(err.errors, res);
      }

      return res.sendStatus(400);
    }
  };

  const destroy = async (req, res) => {
    const { id: userId } = req.params;

    try {
      const userDeleted = await User.destroy({
        where: {
          id: userId
        }
      });

      if (userDeleted) {
        return res.sendStatus(204);
      }

      throw new Error(`Unable to destroy user ${userId}.`);
    } catch (err) {
      const userExists = await userExistsWithId(userId);

      if (!userExists) {
        return res.sendStatus(404);
      }

      return res.sendStatus(400);
    }
  };

  return {
    list: withAuth(list),
    create: withAuth(create),
    update: withAuth(update),
    destroy: withAuth(destroy)
  };
})();
