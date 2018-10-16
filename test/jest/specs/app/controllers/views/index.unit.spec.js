const { setup } = require('controller-test-helpers');
const indexController = require('app/controllers/views/index');

describe('the get method', () => {
  it('should render index view', () => {
    // arrange
    const { req, res } = setup();

    // act
    indexController.get(req, res);

    // assert
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render).toHaveBeenCalledWith('index');
  });
});
