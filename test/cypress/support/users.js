Cypress.Commands.add(
  'createUser',
  ({ username, password, access: accessNames }) =>
    cy
      .log(`creating "${username}"...`)
      .request('GET', '/api/access')
      .then(({ body: accessOptions }) =>
        cy
          .request('POST', '/api/users/', {
            username,
            password,
            access: accessNames.map(
              accessName =>
                accessOptions.find(({ name }) => name === accessName).id
            )
          })
          .log(`"${username}" created.`)
      )
);

Cypress.Commands.add('destroyUser', ({ username }) =>
  cy
    .log(`attempting to destroy "${username}"...`)
    .request('GET', '/api/users')
    .then(response => {
      const userMatch = response.body.find(user => user.username === username);

      if (userMatch) {
        return cy
          .request('DELETE', `/api/users/${userMatch.id}`)
          .log(`"${username}" destroyed.`);
      }

      return cy.log(`"${username}" does not exist.`);
    })
);
