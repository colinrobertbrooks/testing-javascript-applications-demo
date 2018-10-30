Cypress.Commands.add('loginAsCypress', ({ logging = true } = {}) =>
  cy.fixture('users/cypress').then(({ username, password }) => {
    if (logging) {
      cy.log(`logging in.`);
    }

    return cy.request('POST', '/login', { username, password });
  })
);

Cypress.Commands.add('loginAsUser', ({ username, password }) =>
  cy
    .log(`logging in as "${username}"...`)
    .request('POST', '/login', { username, password })
    .log(`logged in as "${username}".`)
);

Cypress.Commands.add('logout', ({ logging = true } = {}) => {
  if (logging) {
    cy.log(`logging out.`);
  }

  return cy.request('GET', '/logout');
});
