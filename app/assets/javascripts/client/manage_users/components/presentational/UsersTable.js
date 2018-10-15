import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import UserUpdateModalToggle from './UserUpdateModalToggle';
import UserDeleteModalToggleContainer from '../container/UserDeleteModalToggleContainer';
import { userType } from '../../constants/types';

const UsersTable = ({ users, getAccessName }) => (
  <Table striped bordered responsive size="sm">
    <thead className="text-center">
      <tr>
        <th>Username</th>
        <th>Access</th>
        <th style={{ minWidth: 150 }}>Options</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {users.map(user => {
        const { id: userId, username, access } = user;

        return (
          <tr key={userId}>
            <td>{username}</td>
            <td>
              <ul className="list-unstyled">
                {access.map(id => (
                  <li key={id}>{getAccessName(id)}</li>
                ))}
              </ul>
            </td>
            <td>
              <UserUpdateModalToggle user={user} />{' '}
              <UserDeleteModalToggleContainer user={user} />
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

UsersTable.propTypes = {
  users: PropTypes.arrayOf(userType).isRequired,
  getAccessName: PropTypes.func.isRequired
};

export default UsersTable;
