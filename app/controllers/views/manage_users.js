const withAuthorization = require('../../helpers/controllers/views/withAuthorization');

const accessName = 'Admin';
const viewName = 'Manage Users';

const get = (req, res) => {
  res.render('manage_users');
};

module.exports = {
  get: withAuthorization({ wrappedMethod: get, accessName, viewName })
};
