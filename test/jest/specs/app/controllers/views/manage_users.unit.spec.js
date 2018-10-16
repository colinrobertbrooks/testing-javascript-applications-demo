const { viewWithAuthorizationSpec } = require('controller-test-helpers');

viewWithAuthorizationSpec({
  accessName: 'Admin',
  view: 'manage_users',
  viewName: 'Manage Users'
});
