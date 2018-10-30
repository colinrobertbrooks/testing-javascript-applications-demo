import views from '../../helpers/views';

describe('authentication/views', () => {
  views
    .filter(({ requiresAuthorization }) => requiresAuthorization)
    .forEach(({ view, viewUrl }) => {
      describe(`${view}`, () => {
        describe('when req is not authenticated', () => {
          it('should redirect to login view with danger alert', () => {
            cy
              // navigate to view url
              .visit(viewUrl)
              // assert redirect to login url
              .assertUrl('/login')
              // assert danger alert
              .getByText('You are not logged in.')
              .isAlertWithDanger();
          });
        });
      });
    });
});
