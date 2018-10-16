const setup = require('./setup');

module.exports = ({ method, andReqIsAuthorized }) => {
  describe('when req is authenticated', () => {
    describe('and req is authorized', andReqIsAuthorized);

    describe('and req is not authorized', () => {
      it('should 403', async () => {
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
        await method(unauthorizedReq, res);

        // assert
        expect(res.sendStatus).toHaveBeenCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
      });
    });
  });

  describe('when req is not authenticated', () => {
    describe('and req is authorized', () => {
      it('should 401', async () => {
        // arrange
        const { req, res } = setup();
        const unauthenticatedReq = {
          ...req,
          isAuthenticated: () => false
        };

        // act
        await method(unauthenticatedReq, res);

        // assert
        expect(res.sendStatus).toHaveBeenCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
      });
    });
  });
};
