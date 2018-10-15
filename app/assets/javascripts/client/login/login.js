/* eslint-disable global-require */
import 'bootstrap/dist/css/bootstrap.css';

import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';

import '../../../stylesheets/base.css';

import '../../universal/components/navbar/navbar';
import '../../universal/components/footer/footer';
import Root from './components/Root';

render(
  <HotContainer>
    <Root />
  </HotContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextRoot = require('./components/Root').default;

    render(
      <HotContainer>
        <NextRoot />
      </HotContainer>,
      document.getElementById('root')
    );
  });
}
