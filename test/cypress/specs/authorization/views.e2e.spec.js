import authorizationSpec from '../../helpers/authorizationSpec';
import views from '../../helpers/views';

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
              it(`should render ${view} view`, () => {
                cy
                  // navigate to view url
                  .visit(viewUrl)
                  // assert view name
                  .getByTestId('view-name')
                  .should('have.text', viewName);
              });
            },
            whenReqIsNotAuthorized() {
              it('should redirect to index view with danger alert', () => {
                cy
                  // navigate to viewUrl
                  .visit(viewUrl)
                  // assert redirect to index url
                  .assertUrl('/')
                  // assert danger alert
                  .getByText(`You are not authorized to access ${viewName}.`)
                  .isAlertWithDanger();
              });
            }
          });
        });
      }
    );
});
