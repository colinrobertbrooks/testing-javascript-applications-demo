describe('authentication/login', () => {
  it('should redirect to index view with success alert on successful login', () => {
    cy
      // load user from fixtures
      .fixture('users/cypress')
      .then(user => {
        cy
          // navigate to login view
          .visit('/login')
          // fill out form and submit with login submit button
          .getByLabelText('Username')
          .type(user.username)
          .getByLabelText('Password')
          .type(user.password)
          .getByText('Submit')
          .click()
          // assert redirect to index url
          .assertUrl('/')
          // assert success alert
          .getByText('Logged in successfully.')
          .isAlertWithSuccess();
      });
  });

  it('should redirect to login view with danger alert on unsuccessful login', () => {
    cy
      // load user from fixtures
      .fixture('users/cypress')
      .then(user => {
        cy
          // navigate to login view
          .visit('/login')
          // fill out form with bad password and submit with enter key
          .getByLabelText('Username')
          .type(user.username)
          .getByLabelText('Password')
          .type(
            `${user.password
              .split('')
              .reverse()
              .join('')}{enter}`
          )
          // assert redirect to login url
          .assertUrl('/login')
          // assert danger alert
          .getByText('Invalid username and/or password.')
          .isAlertWithDanger();
      });
  });

  it('should redirect to index view with warning alert when user is already logged in', () => {
    cy
      // login programmatically (access is irrelevant)
      .loginAsCypress()
      // navigate to login view
      .visit('/login')
      // asssert redirect to index url
      .assertUrl('/')
      // asssert warning alert
      .getByText("You're already logged in.")
      .isAlertWithWarning();
  });
});
