function setup() {
  const passport = {
    authenticate: jest.fn(() => jest.fn())
  };
  const req = {
    flash: jest.fn(),
    logout: jest.fn()
  };
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    sendStatus: jest.fn()
  };

  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this;
      }.bind(res)
    ),
    json: jest.fn(
      function json() {
        return this;
      }.bind(res)
    ),
    send: jest.fn(
      function send() {
        return this;
      }.bind(res)
    )
  });

  return { passport, req, res };
}

module.exports = setup;
