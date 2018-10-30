describe('authentication/logout', () => {
  it('should redirect to index view with success alert on successful logout', () => {
    cy
      // login programmatically (access is irrelevant)
      .loginAsCypress()
      // navigate to index view
      .visit('/')
      // get logout
      .visit('/logout')
      // assert redirect to index url
      .assertUrl('/')
      // assert success alert
      .getByText('Logged out successfully.')
      .isAlertWithSuccess();
  });

  it('should redirect to index view with danger alert on unsuccessful logout', () => {
    cy
      // navigate to index view
      .visit('/')
      // get logout
      .visit('/logout')
      // assert redirect to index url
      .assertUrl('/')
      // assert warning alert
      .getByText('No user to log out.')
      .isAlertWithDanger();
  });
});
