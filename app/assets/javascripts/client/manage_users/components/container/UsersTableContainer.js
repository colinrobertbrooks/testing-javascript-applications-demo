import React from 'react';

import { Consumer } from '../../context';
import UsersTable from '../presentational/UsersTable';

const UsersTableContainer = props => (
  <Consumer>
    {({ users, getAccessName }) => (
      <UsersTable {...props} users={users} getAccessName={getAccessName} />
    )}
  </Consumer>
);

export default UsersTableContainer;
