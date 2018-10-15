/* eslint-disable global-require */
import React from 'react';
import { hydrate, render } from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';

import Footer from './components/Footer';

const { footerProps } = window;

delete window.footerProps;

hydrate(
  <HotContainer>
    <Footer {...footerProps} />
  </HotContainer>,
  document.getElementById('footer')
);

if (module.hot) {
  module.hot.accept('./components/Footer', () => {
    const NextFooter = require('./components/Footer').default;

    render(
      <HotContainer>
        <NextFooter {...footerProps} />
      </HotContainer>,
      document.getElementById('footer')
    );
  });
}
