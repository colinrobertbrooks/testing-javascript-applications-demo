import React from 'react';

import { Consumer } from '../../context';
import UserForm from '../presentational/UserForm';

const UserFormContainer = props => (
  <Consumer>
    {({ accessOptions }) => (
      <UserForm {...props} accessOptions={accessOptions} />
    )}
  </Consumer>
);

export default UserFormContainer;
