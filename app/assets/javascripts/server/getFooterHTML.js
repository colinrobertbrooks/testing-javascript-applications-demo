/* eslint-disable global-require */
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const env = process.env.NODE_ENV;

module.exports = props => {
  const Footer = require('../universal/components/footer/components/Footer')
    .default;

  if (env !== 'production') {
    delete require.cache[
      require.resolve('../universal/components/footer/components/Footer')
    ];
  }

  return ReactDOMServer.renderToString(React.createFactory(Footer)(props));
};
