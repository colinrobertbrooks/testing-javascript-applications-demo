const withAuthorization = require('../../helpers/controllers/views/withAuthorization');

const accessName = 'Feature 1';
const viewName = 'Feature 1';

const get = (req, res) => {
  res.render('feature_1');
};

module.exports = {
  get: withAuthorization({ wrappedMethod: get, accessName, viewName })
};
