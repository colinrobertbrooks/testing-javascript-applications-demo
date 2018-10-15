import React from 'react';

import { Consumer } from '../../context';
import UserDeleteModalToggle from '../presentational/UserDeleteModalToggle';
import { userType } from '../../constants/types';

const UserDeleteModalToggleContainer = ({ user }) => (
  <Consumer>
    {({ getAccessName, deleteUser }) => (
      <UserDeleteModalToggle
        user={user}
        getAccessName={getAccessName}
        deleteUser={deleteUser}
      />
    )}
  </Consumer>
);

UserDeleteModalToggleContainer.propTypes = {
  user: userType.isRequired
};

export default UserDeleteModalToggleContainer;
