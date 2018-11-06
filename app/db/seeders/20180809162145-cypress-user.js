const { User, Access } = require('../../models');
const passwordHelper = require('../../helpers/authentication/password');

const username = 'cypress';
const password = 'password';

module.exports = {
  up: async () => {
    const { hash, salt } = await passwordHelper.encrypt(password);
    const cypressUser = await User.create({
      username,
      password: hash,
      salt
    });

    const allAccessIds = await Access.findAll({
      attributes: ['id']
    }).map(({ dataValues }) => dataValues.id);

    await cypressUser.addAccess(allAccessIds);
  },

  down: () =>
    User.destroy({
      where: {
        username
      }
    })
};
