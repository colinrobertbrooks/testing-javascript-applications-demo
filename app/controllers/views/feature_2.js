const withAuthorization = require('../../helpers/controllers/views/withAuthorization');

const accessName = 'Feature 2';
const viewName = 'Feature 2';

const get = (req, res) => {
  res.render('feature_2');
};

module.exports = {
  get: withAuthorization({ wrappedMethod: get, accessName, viewName })
};
