import authorizationSpec from '../../helpers/authorizationSpec';
import views from '../../helpers/views';

describe('shared/navbar', () => {
  describe('brand', () => {
    it('should navigate to index view on click', () => {
      cy
        // navigate to login view
        .visit('/login')
        // click brand
        .getByTestId('navbar-brand')
        .click()
        // assert navigation to index url
        .assertUrl('/');
    });
  });

  describe('links', () => {
    describe('authentication', () => {
      describe('when req is not authenticated', () => {
        it('should render Log In link', () => {
          cy
            // navigate to index view
            .visit('/')
            // assert log in link exists
            .getLinkByText('Log In');
        });

        it('should navigate to login view on Log In link click', () => {
          cy
            // navigate to index view
            .visit('/')
            // click log in link
            .getLinkByText('Log In')
            .click()
            // assert navigation to login url
            .assertUrl('/login');
        });

        it('should set Log In link as active on login view', () => {
          cy
            // navigate to login view
            .visit('/login')
            // assert log in link is active
            .getLinkByText('Log In')
            .isActive();
        });
      });

      describe('when req is authenticated', () => {
        beforeEach(() => {
          // login programmatically (access is irrelevant)
          cy.loginAsCypress();
        });

        it('should render Log Out link', () => {
          cy
            // navigate to index view
            .visit('/')
            // assert log out link exists
            .getLinkByText('Log Out');
        });

        it('should logout user on Log Out link click', () => {
          cy
            // navigate to index view
            .visit('/')
            // click log out link
            .getLinkByText('Log Out')
            .click()
            // assert user is logged out
            .getByText('Logged out successfully.');
        });
      });
    });

    describe('authorization', () => {
      views
        .filter(({ requiresAuthorization }) => requiresAuthorization)
        .forEach(
          ({
            view,
            viewName,
            viewUrl,
            authorizedUserFixture,
            unauthorizedUserFixture
          }) => {
            describe(`${view}`, () => {
              authorizationSpec({
                authorizedUserFixture,
                unauthorizedUserFixture,
                whenReqIsAuthorized() {
                  it(`should render ${viewName} link`, () => {
                    cy
                      // navigate to index view
                      .visit('/')
                      // assert view name link exists
                      .getLinkByText(viewName);
                  });

                  it(`should navigate to ${view} view on ${viewName} link click`, () => {
                    cy
                      // navigate to index view
                      .visit('/')
                      // click view name link
                      .getLinkByText(viewName)
                      .click()
                      // assert navigation to view url
                      .assertUrl(viewUrl);
                  });

                  it(`should set ${viewName} link as active on ${view} view`, () => {
                    cy
                      // navigate to view url
                      .visit(viewUrl)
                      // assert view name link is active
                      .getLinkByText(viewName)
                      .isActive();
                  });
                },
                whenReqIsNotAuthorized() {
                  it(`should not render ${viewName} link`, () => {
                    cy
                      // navigate to index view
                      .visit('/')
                      // assert login link
                      .queryLinkByText(viewName, { timeout: 100 })
                      .should('not.exist');
                  });
                }
              });
            });
          }
        );
    });
  });
});
