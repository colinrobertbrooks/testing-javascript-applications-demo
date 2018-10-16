/* eslint-disable global-require, import/no-dynamic-require */
const setup = require('./setup');

module.exports = ({ accessName, view, viewName }) => {
  const controller = require(`app/controllers/views/${view}`);

  describe('the get method', () => {
    describe('when req is authenticated', () => {
      describe('and req is authorized', () => {
        it(`should render ${view} view`, () => {
          // arrange
          const { req, res } = setup();
          const authorizedReq = {
            ...req,
            isAuthenticated: () => true,
            user: {
              access: [accessName]
            }
          };

          // act
          controller.get(authorizedReq, res);

          // assert
          expect(res.render).toHaveBeenCalledTimes(1);
          expect(res.render).toHaveBeenCalledWith(view);
          expect(req.flash).not.toHaveBeenCalled();
          expect(res.redirect).not.toHaveBeenCalled();
        });
      });

      describe('and req is not authorized', () => {
        it('should redirect to index and flash error message', () => {
          // arrange
          const { req, res } = setup();
          const unauthorizedReq = {
            ...req,
            isAuthenticated: () => true,
            user: {
              access: []
            }
          };

          // act
          controller.get(unauthorizedReq, res);

          // assert
          expect(req.flash).toHaveBeenCalledTimes(1);
          expect(req.flash).toHaveBeenCalledWith(
            'error',
            `You are not authorized to access ${viewName}.`
          );
          expect(res.redirect).toHaveBeenCalledTimes(1);
          expect(res.redirect).toHaveBeenCalledWith('/');
          expect(res.render).not.toHaveBeenCalled();
        });
      });
    });

    describe('when req is not authenticated', () => {
      it('should redirect to login and flash error message', () => {
        // arrange
        const { req, res } = setup();
        const unauthenticatedReq = {
          ...req,
          isAuthenticated: () => false
        };

        // act
        controller.get(unauthenticatedReq, res);

        // assert
        expect(req.flash).toHaveBeenCalledTimes(1);
        expect(req.flash).toHaveBeenCalledWith(
          'error',
          'You are not logged in.'
        );
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(res.render).not.toHaveBeenCalled();
      });
    });
  });
};
