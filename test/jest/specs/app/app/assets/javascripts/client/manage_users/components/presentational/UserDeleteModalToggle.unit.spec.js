import React from 'react';
import { render } from 'react-testing-library';

import UserDeleteModalToggle from 'app/assets/javascripts/client/manage_users/components/presentational/UserDeleteModalToggle';

function renderUserDeleteModalToggle({ userIsAdmin }) {
  // test data
  const adminUser = {
    id: 1,
    username: 'adminuser',
    access: [1]
  };
  const otherUser = {
    id: 2,
    username: 'otheruser',
    access: [2]
  };

  // mocks
  const getAccessNameMock = jest.fn(accessId => {
    const accessMap = {
      1: 'Admin',
      2: 'Other'
    };

    return accessMap[accessId];
  });

  // render component
  const rtlUtils = render(
    <UserDeleteModalToggle
      user={userIsAdmin ? adminUser : otherUser}
      getAccessName={getAccessNameMock}
      deleteUser={jest.fn()}
    />
  );

  return {
    ...rtlUtils
  };
}

test('cannot delete a user with Admin access', () => {
  const { getByText } = renderUserDeleteModalToggle({ userIsAdmin: true });
  const deleteButton = getByText('Delete');

  expect(deleteButton).toBeDisabled();
  expect(deleteButton).toHaveAttribute(
    'title',
    'Cannot delete a user with Admin access'
  );
});

test('can delete a user without Admin access', () => {
  const { getByText } = renderUserDeleteModalToggle({ userIsAdmin: false });
  const deleteButton = getByText('Delete');

  expect(deleteButton).not.toBeDisabled();
  expect(deleteButton).toHaveAttribute('title', 'Delete otheruser');
});
