const { Access } = require('../../models');
const withAuthorization = require('../../helpers/controllers/api/withAuthorization');

const accessName = 'Admin';

const list = async (req, res) => {
  try {
    const access = await Access.findAll({
      attributes: ['id', 'name']
    });

    return res.json(access);
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = {
  list: withAuthorization({ wrappedMethod: list, accessName })
};
