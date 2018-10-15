/* eslint-disable global-require */
import React from 'react';
import { hydrate, render } from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';

import Navbar from './components/Navbar';

const { navbarProps } = window;

delete window.navbarProps;

hydrate(
  <HotContainer>
    <Navbar {...navbarProps} />
  </HotContainer>,
  document.getElementById('navbar')
);

if (module.hot) {
  module.hot.accept('./components/Navbar', () => {
    const NextNavbar = require('./components/Navbar').default;

    render(
      <HotContainer>
        <NextNavbar {...navbarProps} />
      </HotContainer>,
      document.getElementById('navbar')
    );
  });
}
