import views from '../../helpers/views';

describe('shared/footer', () => {
  describe('when req is not authenticated', () => {
    views
      .filter(({ requiresAuthentication }) => !requiresAuthentication)
      .forEach(({ view, viewUrl }) => {
        it(`should not render footer on ${view} view`, () => {
          cy
            // navigate to view url
            .visit(viewUrl)
            // assert footer does not exist
            .queryByTestId('footer', { timeout: 100 })
            .should('not.exist');
        });
      });
  });

  describe('when req is authenticated', () => {
    beforeEach(() => {
      // login programmatically (cypress has all access)
      cy.loginAsCypress();
    });

    views
      .filter(({ requiresAuthentication }) => requiresAuthentication)
      .forEach(({ view, viewUrl }) => {
        it(`should render footer with username on ${view} view`, () => {
          cy
            // navigate to view url
            .visit(viewUrl)
            // assert footer does not exist
            .getByTestId('footer-username')
            .should('have.text', 'cypress');
        });
      });
  });
});
