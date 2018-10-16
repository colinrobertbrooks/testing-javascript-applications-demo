const { ValidationError, ValidationErrorItem } = require('sequelize');
const {
  apiMethodWithAuthorizationSpec,
  setup
} = require('controller-test-helpers');
const { Access, User } = require('app/models');

jest.mock('app/models', () => ({
  Access: {
    findAll: jest.fn()
  },
  User: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

const hash = 'hash';
const salt = 'salt';

jest.doMock('app/helpers/authentication/password', () => ({
  encrypt: jest.fn().mockReturnValue({ hash, salt })
}));

const usersApiController = require('app/controllers/api/users');

describe('the list method', () => {
  apiMethodWithAuthorizationSpec({
    method: usersApiController.list,
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
        it('should return all users in the database with access by id', async () => {
          // arrange
          User.findAll.mockReturnValueOnce([
            {
              id: 1,
              username: 'user1',
              access: [{ id: 1, name: 'Access 1' }],
              mapAccessBy(mapAttribute) {
                return {
                  id: this.id,
                  username: this.username,
                  access: this.access.map(a => a[mapAttribute])
                };
              }
            }
          ]);

          // act
          await usersApiController.list(authorizedReq, res);

          // assert
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith([
            {
              id: 1,
              username: 'user1',
              access: [1]
            }
          ]);
          expect(res.sendStatus).not.toHaveBeenCalled();
        });
      });

      describe('on error', () => {
        describe('due to unhandled error', () => {
          it('should 400', async () => {
            // arrange
            User.findAll.mockRejectedValueOnce(
              new Error('ConnectionTimedOutError')
            );

            // act
            await usersApiController.list(authorizedReq, res);

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

describe('the create method', () => {
  apiMethodWithAuthorizationSpec({
    method: usersApiController.create,
    andReqIsAuthorized: () => {
      // setup
      const access = [
        { dataValues: { name: 'Access 1', id: 1 } },
        { dataValues: { name: 'Access 2', id: 2 } }
      ];
      const user = {
        username: 'username',
        password: 'password',
        access: [1]
      };
      const createArgs = {
        username: user.username
      };
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
        it('should 201', async () => {
          // arrange
          const addAccesses = jest.fn();
          Access.findAll.mockReturnValueOnce(access);
          User.create.mockReturnValueOnce({ addAccesses });

          // act
          await usersApiController.create(
            { ...authorizedReq, body: user },
            res
          );

          // assert
          expect(User.create).toHaveBeenCalledTimes(1);
          expect(User.create).toHaveBeenCalledWith({
            ...createArgs,
            password: hash,
            salt
          });
          expect(addAccesses).toHaveBeenCalledTimes(1);
          expect(addAccesses).toHaveBeenCalledWith(user.access);
          expect(res.sendStatus).toHaveBeenCalledTimes(1);
          expect(res.sendStatus).toHaveBeenCalledWith(201);
          expect(res.status).not.toHaveBeenCalled();
          expect(res.json).not.toHaveBeenCalled();
          expect(res.send).not.toHaveBeenCalled();
        });
      });

      describe('on error', () => {
        describe('due to access validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);

            // act
            await usersApiController.create(
              { ...authorizedReq, body: { ...user, access: [9999] } },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on access failed']
            });
            expect(User.create).not.toHaveBeenCalled();
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to password validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);

            // act
            await usersApiController.create(
              { ...authorizedReq, body: { ...user, password: ' ' } },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on password failed']
            });
            expect(User.create).not.toHaveBeenCalled();
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to unique violation error', () => {
          it('should 409', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.create.mockRejectedValueOnce(
              new ValidationError(null, [
                new ValidationErrorItem(
                  'username must be unique',
                  'unique violation',
                  'username'
                )
              ])
            );

            // act
            await usersApiController.create(
              {
                ...authorizedReq,
                body: user
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(
              'User already exists with username.'
            );
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
          });
        });

        describe('due to other validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.create.mockRejectedValueOnce(
              new ValidationError(null, [
                new ValidationErrorItem(
                  'Validation on username failed',
                  'Validation error'
                )
              ])
            );

            // act
            await usersApiController.create(
              {
                ...authorizedReq,
                body: { ...user, username: '' }
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on username failed']
            });
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to unhandled error', () => {
          it('should 400', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.create.mockRejectedValueOnce(
              new Error('ConnectionTimedOutError')
            );

            // act
            await usersApiController.create(
              {
                ...authorizedReq,
                body: user
              },
              res
            );

            // assert
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });
      });
    }
  });
});

describe('the update method', () => {
  apiMethodWithAuthorizationSpec({
    method: usersApiController.update,
    andReqIsAuthorized: () => {
      // setup
      const access = [
        { dataValues: { name: 'Access 1', id: 1 } },
        { dataValues: { name: 'Access 2', id: 2 } }
      ];
      const user = {
        id: 1,
        username: 'username',
        access: [1]
      };
      const updateArgs = {
        username: user.username
      };
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
        describe('without password', () => {
          it('should 200', async () => {
            // arrange
            const setAccesses = jest.fn();
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockReturnValueOnce([1]);
            User.findById.mockReturnValueOnce({ setAccesses });

            // act
            await usersApiController.update(
              { ...authorizedReq, params: { id: user.id }, body: user },
              res
            );

            // assert
            expect(User.update).toHaveBeenCalledTimes(1);
            expect(User.update.mock.calls[0][0]).toEqual(updateArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(setAccesses).toHaveBeenCalledTimes(1);
            expect(setAccesses).toHaveBeenCalledWith(user.access);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('with password', () => {
          it('should 200', async () => {
            // arrange
            const setAccesses = jest.fn();
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockReturnValueOnce([1]);
            User.findById.mockReturnValueOnce({ setAccesses });

            // act
            await usersApiController.update(
              {
                ...authorizedReq,
                params: { id: user.id },
                body: { ...user, password: 'password' }
              },
              res
            );

            // assert
            expect(User.update).toHaveBeenCalledTimes(1);
            expect(User.update.mock.calls[0][0]).toEqual({
              ...updateArgs,
              password: hash,
              salt
            });
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(setAccesses).toHaveBeenCalledTimes(1);
            expect(setAccesses).toHaveBeenCalledWith(user.access);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });
      });

      describe('on error', () => {
        describe('due to access validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);

            // act
            await usersApiController.update(
              {
                ...authorizedReq,
                params: { id: user.id },
                body: { ...user, access: [9999] }
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on access failed']
            });
            expect(User.update).not.toHaveBeenCalled();
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to password validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);

            // act
            await usersApiController.update(
              {
                ...authorizedReq,
                params: { id: user.id },
                body: { ...user, password: ' ' }
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on password failed']
            });
            expect(User.update).not.toHaveBeenCalled();
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to unique violation error', () => {
          it('should 409', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockRejectedValueOnce(
              new ValidationError(null, [
                new ValidationErrorItem(
                  'username must be unique',
                  'unique violation',
                  'username'
                )
              ])
            );

            // act
            await usersApiController.update(
              {
                ...authorizedReq,
                params: { id: user.id },
                body: user
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(
              'User already exists with username.'
            );
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
          });
        });

        describe('due to other validation error', () => {
          it('should 422', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockRejectedValueOnce(
              new ValidationError(null, [
                new ValidationErrorItem(
                  'Validation on username failed',
                  'Validation error'
                )
              ])
            );

            // act
            await usersApiController.update(
              {
                ...authorizedReq,
                params: { id: user.id },
                body: { ...user, username: '' }
              },
              res
            );

            // assert
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
              errors: ['Validation on username failed']
            });
            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to not found error', () => {
          it('should 404', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockReturnValueOnce([0]);
            User.findById.mockReturnValueOnce(null);

            // act
            await usersApiController.update(
              { ...authorizedReq, params: { id: user.id }, body: user },
              res
            );

            // assert
            expect(User.update).toHaveBeenCalledTimes(1);
            expect(User.update.mock.calls[0][0]).toEqual(updateArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(404);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to update error', () => {
          it('should 400', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockReturnValueOnce([0]);
            User.findById.mockReturnValueOnce(user);

            // act
            await usersApiController.update(
              { ...authorizedReq, params: { id: user.id }, body: user },
              res
            );

            // assert
            expect(User.update).toHaveBeenCalledTimes(1);
            expect(User.update.mock.calls[0][0]).toEqual(updateArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to unhandled error', () => {
          it('should 400', async () => {
            // arrange
            Access.findAll.mockReturnValueOnce(access);
            User.update.mockRejectedValueOnce(
              new Error('ConnectionTimedOutError')
            );
            User.findById.mockReturnValueOnce(user);

            // act
            await usersApiController.update(
              { ...authorizedReq, params: { id: user.id }, body: user },
              res
            );

            // assert
            expect(User.update).toHaveBeenCalledTimes(1);
            expect(User.update.mock.calls[0][0]).toEqual(updateArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });
      });
    }
  });
});

describe('the destroy method', () => {
  apiMethodWithAuthorizationSpec({
    method: usersApiController.destroy,
    andReqIsAuthorized: () => {
      // setup
      const user = {
        id: 1,
        username: 'username',
        access: [1]
      };
      const destroyArgs = { where: { id: user.id } };
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
        it('should 204', async () => {
          // arrange
          User.destroy.mockReturnValueOnce(1);

          // act
          await usersApiController.destroy(
            { ...authorizedReq, params: { id: user.id } },
            res
          );

          // assert
          expect(User.destroy).toHaveBeenCalledTimes(1);
          expect(User.destroy).toHaveBeenCalledWith(destroyArgs);
          expect(res.sendStatus).toHaveBeenCalledTimes(1);
          expect(res.sendStatus).toHaveBeenCalledWith(204);
          expect(res.status).not.toHaveBeenCalled();
          expect(res.json).not.toHaveBeenCalled();
          expect(res.send).not.toHaveBeenCalled();
        });
      });

      describe('on error', () => {
        describe('due to not found error', () => {
          it('should 404', async () => {
            // arrange
            User.destroy.mockReturnValueOnce(0);
            User.findById.mockReturnValueOnce(null);

            // act
            await usersApiController.destroy(
              { ...authorizedReq, params: { id: user.id } },
              res
            );

            // assert
            expect(User.destroy).toHaveBeenCalledTimes(1);
            expect(User.destroy).toHaveBeenCalledWith(destroyArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(404);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to destroy error', () => {
          it('should 400', async () => {
            // arrange
            User.destroy.mockReturnValueOnce(0);
            User.findById.mockReturnValueOnce(user);

            // act
            await usersApiController.destroy(
              { ...authorizedReq, params: { id: user.id } },
              res
            );

            // assert
            expect(User.destroy).toHaveBeenCalledTimes(1);
            expect(User.destroy).toHaveBeenCalledWith(destroyArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });

        describe('due to unhandled error', () => {
          it('should 400', async () => {
            // arrange
            User.destroy.mockRejectedValueOnce(
              new Error('ConnectionTimedOutError')
            );
            User.findById.mockReturnValueOnce(user);

            // act
            await usersApiController.destroy(
              { ...authorizedReq, params: { id: user.id } },
              res
            );

            // assert
            expect(User.destroy).toHaveBeenCalledTimes(1);
            expect(User.destroy).toHaveBeenCalledWith(destroyArgs);
            expect(User.findById).toHaveBeenCalledTimes(1);
            expect(User.findById).toHaveBeenCalledWith(user.id);
            expect(res.sendStatus).toHaveBeenCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
          });
        });
      });
    }
  });
});
