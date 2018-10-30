const getIdForUsername = username =>
  cy
    .log(`attempting to get id for "${username}"...`)
    .request('GET', '/api/users')
    .then(response => {
      const userMatch = response.body.find(user => user.username === username);

      if (userMatch) {
        const { id: userId } = userMatch;

        return cy.log(`"${username}" has id ${userId}.`).then(() => userId);
      }

      return cy.log(`"${username}" does not exist.`).then(() => null);
    });

describe('views/manage_users', () => {
  before(() => {
    // create admin user programmatically
    cy.fixture('users/admin').then(adminUser =>
      cy
        .loginAsCypress({ logging: false })
        .createUser(adminUser)
        .logout({ logging: false })
    );
  });

  beforeEach(() => {
    cy
      // login as admin programmatically
      .fixture('users/admin')
      .then(adminUser => cy.loginAsUser(adminUser))
      // navigate to manage users view
      .visit('/admin/manage-users');
  });

  afterEach(() => {
    // destroy new user programmatically
    cy.fixture('users/new').then(newUser =>
      cy
        .loginAsCypress({ logging: false })
        .destroyUser(newUser)
        .logout({ logging: false })
    );
  });

  after(() => {
    // destroy admin user programmatically
    cy.fixture('users/admin').then(adminUser =>
      cy
        .loginAsCypress({ logging: false })
        .destroyUser(adminUser)
        .logout({ logging: false })
    );
  });

  it('should create user', () => {
    // load new user from fixtures
    cy.fixture('users/new').then(({ username, access, password }) =>
      cy
        // open create user modal
        .getByTestId('create-user-button')
        .click()
        .wait(300)
        // fill out form
        .getByLabelText('Username')
        .type(username)
        .getByLabelText('Access')
        .select(access)
        .getByLabelText('Password')
        .type(password)
        // click submit (closes modal)
        .getByText('Submit')
        .click()
        // assert new user was created
        .getByText(`User "${username}" created successfully.`)
        .then(() =>
          getIdForUsername(username).then(userId => {
            cy.getByTestId(`user-${userId}-username`).should(
              'have.text',
              username
            );
            access.forEach(accessName => {
              cy.getByTestId(`user-${userId}-access`).contains(accessName);
            });
          })
        )
    );
  });

  it('should update user', () => {
    // load new user from fixtures
    cy.fixture('users/new').then(newUser => {
      cy
        // create new user programmatically
        .createUser(newUser)
        // reload page
        .reload()
        .then(() =>
          getIdForUsername(newUser.username).then(userId => {
            const { updatedAccess } = newUser;

            cy
              // open update user modal
              .getByTestId(`update-user-${userId}`)
              .click()
              .wait(300)
              // fill out form
              .getByLabelText('Access')
              .select(updatedAccess)
              // click submit (closes modal)
              .getByText('Submit')
              .click()
              // assert new user was updated
              .getByText(`User "${newUser.username}" updated successfully.`)
              .then(() => {
                updatedAccess.forEach(accessName => {
                  cy.getByTestId(`user-${userId}-access`).contains(accessName);
                });
              });
          })
        );
    });
  });

  it('should delete user', () => {
    // load new user from fixtures
    cy.fixture('users/new').then(newUser => {
      cy
        // create user programmatically
        .createUser(newUser)
        // reload page
        .reload()
        .then(() =>
          getIdForUsername(newUser.username).then(userId => {
            cy
              // open delete user modal
              .getByTestId(`delete-user-${userId}`)
              .click()
              .wait(300)
              // click submit (closes modal)
              .getByText('Submit')
              .click()
              // assert new user was deleted
              .getByText(`User "${newUser.username}" deleted successfully.`)
              // see: https://github.com/kentcdodds/cypress-testing-library/issues/13
              .get(`[data-testid="user-${userId}-row"]`)
              .should('not.exist');
          })
        );
    });
  });
});
