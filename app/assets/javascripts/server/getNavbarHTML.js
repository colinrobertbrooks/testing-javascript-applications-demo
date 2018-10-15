/* eslint-disable global-require */
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const env = process.env.NODE_ENV;

module.exports = props => {
  const Navbar = require('../universal/components/navbar/components/Navbar')
    .default;

  if (env !== 'production') {
    delete require.cache[
      require.resolve('../universal/components/navbar/components/Navbar')
    ];
  }

  return ReactDOMServer.renderToString(React.createFactory(Navbar)(props));
};
