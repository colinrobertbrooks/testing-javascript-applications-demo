// because cypress cannot execute commands outside a running test (i.e. `cy.fixture`)
export default [
  {
    view: 'index',
    viewName: 'Welcome',
    viewUrl: '/',
    requiresAuthentication: false,
    requiresAuthorization: false
  },
  {
    view: 'login',
    viewName: 'Log In',
    viewUrl: '/login',
    requiresAuthentication: false,
    requiresAuthorization: false
  },
  {
    view: 'feature_1',
    viewName: 'Feature 1',
    viewUrl: '/features/1',
    requiresAuthentication: true,
    requiresAuthorization: true,
    authorizedUserFixture: 'users/feature_1',
    unauthorizedUserFixture: 'users/feature_2'
  },
  {
    view: 'feature_2',
    viewName: 'Feature 2',
    viewUrl: '/features/2',
    requiresAuthentication: true,
    requiresAuthorization: true,
    authorizedUserFixture: 'users/feature_2',
    unauthorizedUserFixture: 'users/feature_1'
  },
  {
    view: 'manage_users',
    viewName: 'Manage Users',
    viewUrl: '/admin/manage-users',
    requiresAuthentication: true,
    requiresAuthorization: true,
    authorizedUserFixture: 'users/admin',
    unauthorizedUserFixture: 'users/feature_1'
  }
];
