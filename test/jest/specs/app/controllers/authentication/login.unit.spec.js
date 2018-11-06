/* eslint-disable import/order */
const { setup } = require('controller-test-helpers');

const { passport } = setup();

const loginController = require('app/controllers/authentication/login')(
  passport
);

describe('the get method', () => {
  describe('when req.user is present', () => {
    it('should redirect to index and flash warning message', () => {
      // arrange
      const { req, res } = setup();
      const reqWithUser = {
        ...req,
        user: {
          username: 'username'
        }
      };

      // act
      loginController.get(reqWithUser, res);

      // assert
      expect(req.flash).toHaveBeenCalledTimes(1);
      expect(req.flash).toHaveBeenCalledWith(
        'warning',
        "You're already logged in."
      );
      expect(res.redirect.mock.calls).toHaveLength(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(res.render).not.toHaveBeenCalled();
    });
  });

  describe('when req.user is not present', () => {
    it('should render login view', () => {
      // arrange
      const { req, res } = setup();

      // act
      loginController.get(req, res);

      // assert
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('login');
      expect(req.flash).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });
});

describe('the post method', () => {
  it('should envoke passport.authenticate', () => {
    // arrange
    const { req, res } = setup();

    // act
    loginController.post(req, res);

    // assert
    expect(passport.authenticate).toHaveBeenCalledTimes(1);
    expect(passport.authenticate).toHaveBeenCalledWith('local', {
      successRedirect: '/',
      successFlash: 'Logged in successfully.',
      failureRedirect: '/login',
      failureFlash: 'Invalid username and/or password.'
    });
  });
});
