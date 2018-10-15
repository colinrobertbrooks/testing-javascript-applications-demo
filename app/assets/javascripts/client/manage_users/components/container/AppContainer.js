import React from 'react';

import { Consumer } from '../../context';
import App from '../presentational/App';

const AppContainer = () => (
  <Consumer>
    {({ isLoading, hasError, users, alert, clearAlert }) => (
      <App
        isLoading={isLoading}
        hasError={hasError}
        users={users}
        alert={alert}
        clearAlert={clearAlert}
      />
    )}
  </Consumer>
);

export default AppContainer;
