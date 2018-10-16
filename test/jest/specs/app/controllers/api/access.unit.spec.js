const {
  apiMethodWithAuthorizationSpec,
  setup
} = require('controller-test-helpers');
const accessApiController = require('app/controllers/api/access');
const { Access } = require('app/models');

jest.mock('app/models', () => ({
  Access: {
    findAll: jest.fn()
  }
}));

describe('the list method', () => {
  apiMethodWithAuthorizationSpec({
    method: accessApiController.list,
    andReqIsAuthorized: () => {
      // setup
      let req;
      let res;
      let authorizedReq;

      beforeEach(() => {
        ({ req, res } = setup());
        authorizedReq = {
          ...req,
          isAuthenticated: () => true,
          user: {
            access: ['Admin']
          }
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      describe('on success', () => {
        it('should return all access in the database', async () => {
          // arrange
          const access = [
            { id: 1, name: 'Access 1' },
            { id: 2, name: 'Access 2' }
          ];
          Access.findAll.mockReturnValueOnce(access);

          // act
          await accessApiController.list(authorizedReq, res);

          // assert
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith(access);
          expect(res.sendStatus).not.toHaveBeenCalled();
        });
      });

      describe('on error', () => {
        describe('due to unhandled error', () => {
          it('should 400', async () => {
            // arrange
            Access.findAll.mockRejectedValueOnce(
              new Error('ConnectionTimedOutError')
            );

            // act
            await accessApiController.list(authorizedReq, res);

            // assert
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.json).not.toHaveBeenCalled();
          });
        });
      });
    }
  });
});
