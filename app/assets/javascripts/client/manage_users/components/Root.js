import React from 'react';

import { Provider } from '../context';
import AppContainer from './container/AppContainer';

const Root = () => (
  <Provider>
    <AppContainer />
  </Provider>
);

export default Root;
