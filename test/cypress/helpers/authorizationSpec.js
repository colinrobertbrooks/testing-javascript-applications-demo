// DRYing authorization spec setup
export default ({
  authorizedUserFixture,
  unauthorizedUserFixture,
  whenReqIsAuthorized,
  whenReqIsNotAuthorized
}) => {
  describe('when req is authorized', () => {
    before(() => {
      // create authorized user programmatically
      cy.fixture(authorizedUserFixture).then(authorizedUser =>
        cy
          .loginAsCypress({ logging: false })
          .createUser(authorizedUser)
          .logout({ logging: false })
      );
    });

    beforeEach(() => {
      // login as authorized user programmatically
      cy.fixture(authorizedUserFixture).then(authorizedUser =>
        cy.loginAsUser(authorizedUser)
      );
    });

    after(() => {
      // destroy authorized user programmatically
      cy.fixture(authorizedUserFixture).then(authorizedUser =>
        cy
          .loginAsCypress({ logging: false })
          .destroyUser(authorizedUser)
          .logout({ logging: false })
      );
    });

    // assertions...
    whenReqIsAuthorized();
  });

  describe('when req is not authorized', () => {
    before(() => {
      // create unauthorized user programmatically
      cy.fixture(unauthorizedUserFixture).then(unauthorizedUser =>
        cy
          .loginAsCypress({ logging: false })
          .createUser(unauthorizedUser)
          .logout({ logging: false })
      );
    });

    beforeEach(() => {
      // login as unauthorized user programmatically
      cy.fixture(unauthorizedUserFixture).then(unauthorizedUser =>
        cy.loginAsUser(unauthorizedUser)
      );
    });

    after(() => {
      // destroy unauthorized user programmatically
      cy.fixture(unauthorizedUserFixture).then(unauthorizedUser =>
        cy
          .loginAsCypress({ logging: false })
          .destroyUser(unauthorizedUser)
          .logout({ logging: false })
      );
    });

    // assertions...
    whenReqIsNotAuthorized();
  });
};
