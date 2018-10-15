const { User, Access } = require('../../models');
const passwordHelper = require('../../helpers/authentication/password');

const username = 'admin';
const password = 'password';

module.exports = {
  up: async () => {
    const { hash, salt } = await passwordHelper.encrypt(password);
    const adminUser = await User.create({
      username,
      password: hash,
      salt
    });

    const adminAccess = await Access.findOne({
      where: {
        name: 'Admin'
      }
    });

    await adminUser.addAccess(adminAccess.id);
  },

  down: () =>
    User.destroy({
      where: {
        username
      }
    })
};
