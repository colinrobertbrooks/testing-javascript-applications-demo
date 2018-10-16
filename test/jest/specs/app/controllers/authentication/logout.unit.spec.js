const { setup } = require('controller-test-helpers');
const logoutController = require('app/controllers/authentication/logout');

describe('the get method', () => {
  describe('when req.user is present', () => {
    it('should logout user, redirect to index and flash success message', () => {
      // arrange
      const { req, res } = setup();
      const reqWithUser = {
        ...req,
        user: {
          username: 'username'
        }
      };

      // act
      logoutController.get(reqWithUser, res);

      // assert
      expect(req.flash).toHaveBeenCalledTimes(1);
      expect(req.flash).toHaveBeenCalledWith(
        'success',
        'Logged out successfully.'
      );
      expect(req.logout).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('when req.user is not present', () => {
    it('should redirect to index and flash error message', () => {
      // arrange
      const { req, res } = setup();

      // act
      logoutController.get(req, res);

      // assert
      expect(req.flash).toHaveBeenCalledTimes(1);
      expect(req.flash).toHaveBeenCalledWith('error', 'No user to log out.');
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(req.logout).not.toHaveBeenCalled();
    });
  });
});
