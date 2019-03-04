import { makeInputChange, makeSelectMultipleChange } from 'form-test-helpers';
import React from 'react';
import { render, fireEvent, wait, within } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';

import Root from 'app/assets/javascripts/client/manage_users/components/Root';
import { adapter } from 'app/assets/javascripts/client/manage_users/api';

const mockAdapter = new MockAdapter(adapter);

afterEach(() => {
  mockAdapter.reset();
});

async function renderRoot({
  accessApiResponseCode = null,
  accessApiResponseData = null,
  usersApiResponseCode = null,
  usersApiResponseData = null
} = {}) {
  // test data
  const accessOptions = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Feature 1' },
    { id: 3, name: 'Feature 2' }
  ];
  const users = [
    { id: 1, username: 'admin', access: [1, 2] },
    { id: 2, username: 'userone', access: [2] }
  ];
  const newUser = {
    id: 3,
    username: 'usertwo',
    access: [2],
    password: 'PaS$w@rD'
  };
  const existingUser = { ...users[1], password: 'PaS$w@rD' };
  const updatedUser = { ...existingUser, username: 'updatedusertwo' };

  // default initial api responses
  mockAdapter
    .onGet('/access')
    .replyOnce(
      accessApiResponseCode || 200,
      accessApiResponseData || accessOptions
    );
  mockAdapter
    .onGet('/users')
    .replyOnce(usersApiResponseCode || 200, usersApiResponseData || users);

  // render component
  const rtlUtils = render(<Root />);

  // helper methods
  const clickCreateUserButton = () => {
    const createUserButton = rtlUtils.getByTestId('create-user-button');
    fireEvent.click(createUserButton);
  };

  const clickUpdateUserButton = userId => {
    const updateUserButton = rtlUtils.getByTestId(`update-user-${userId}`);
    fireEvent.click(updateUserButton);
  };

  const clickDeleteUserButton = userId => {
    const deleteUserButton = rtlUtils.getByTestId(`delete-user-${userId}`);
    fireEvent.click(deleteUserButton);
  };

  const fillOutUserFormForMethod = (method, values) => {
    const usernameInput = rtlUtils.getByLabelText('Username');
    const accessSelect = rtlUtils.getByLabelText('Access');
    const passwordInput = rtlUtils.getByLabelText(
      `${method === 'update' ? 'New ' : ''}Password`
    );

    if (Object.keys(values).includes('username')) {
      makeInputChange({ element: usernameInput, value: values.username });
    }

    if (Object.keys(values).includes('access')) {
      makeSelectMultipleChange({
        element: accessSelect,
        values: values.access
      });
    }

    if (Object.keys(values).includes('password')) {
      makeInputChange({ element: passwordInput, value: values.password });
    }
  };

  const clickSubmitButton = () => {
    const submitButton = rtlUtils.getByText('Submit');
    fireEvent.click(submitButton);
  };

  const clickCancelButton = () => {
    const cancelButton = rtlUtils.getByText('Cancel');
    fireEvent.click(cancelButton);
  };

  const assertUsersTableCount = count =>
    expect(rtlUtils.queryAllByTestId(/user-\d*-row/)).toHaveLength(count);

  const assertUserInUsersTable = ({ id: userId, username, access }) => {
    const usersTable = rtlUtils.getByTestId('users-table');
    const userRow = rtlUtils.getByTestId(`user-${userId}-row`);
    const { getByTestId } = within(userRow);

    expect(usersTable).toContainElement(userRow);
    expect(getByTestId(`user-${userId}-username`)).toHaveTextContent(username);
    access.forEach(accessId =>
      expect(getByTestId(`user-${userId}-access`)).toHaveTextContent(
        accessOptions.find(({ id }) => id === accessId).name
      )
    );
  };

  // assert shared initial expectations
  expect(rtlUtils.getByTestId('view-name')).toHaveTextContent('Manage Users');
  expect(rtlUtils.getByTestId('is-loading-text')).toHaveTextContent(
    'Loading...'
  );

  // wait for initial api responses to complete
  await wait(() =>
    expect(rtlUtils.queryByTestId('is-loading-text')).not.toBeInTheDocument()
  );

  return {
    ...rtlUtils,
    users,
    newUser,
    existingUser,
    updatedUser,
    clickCreateUserButton,
    clickUpdateUserButton,
    clickDeleteUserButton,
    fillOutUserFormForMethod,
    clickSubmitButton,
    clickCancelButton,
    assertUsersTableCount,
    assertUserInUsersTable
  };
}

describe('initial list of users', () => {
  describe('with successful fetch', () => {
    test('returning user data', async () => {
      const {
        getByTestId,
        queryByTestId,
        users,
        assertUsersTableCount,
        assertUserInUsersTable
      } = await renderRoot();

      // assert
      expect(getByTestId('create-user-button')).toHaveTextContent('Create');
      expect(getByTestId('users-table')).toBeInTheDocument();
      assertUsersTableCount(users.length);
      users.forEach(user => assertUserInUsersTable(user));
      expect(queryByTestId('no-users-text')).not.toBeInTheDocument();
      expect(queryByTestId('has-error-text')).not.toBeInTheDocument();
      expect(queryByTestId('create-user-modal')).not.toBeInTheDocument();
      expect(queryByTestId('update-user-modal')).not.toBeInTheDocument();
      expect(queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });

    test('returning no user data', async () => {
      const { getByTestId, queryByTestId } = await renderRoot({
        usersApiResponseData: []
      });

      expect(getByTestId('create-user-button')).toHaveTextContent('Create');
      expect(getByTestId('no-users-text')).toHaveTextContent('No users.');
      expect(queryByTestId('users-table')).not.toBeInTheDocument();
      expect(queryByTestId('has-error-text')).not.toBeInTheDocument();
      expect(queryByTestId('create-user-modal')).not.toBeInTheDocument();
      expect(queryByTestId('update-user-modal')).not.toBeInTheDocument();
      expect(queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });
  });

  test('with unsuccesful fetch', async () => {
    const { getByTestId, queryByTestId } = await renderRoot({
      accessApiResponseCode: 500,
      accessApiResponseData: null,
      usersApiResponseCode: 500,
      usersApiResponseData: null
    });

    // assert
    expect(getByTestId('has-error-text')).toHaveTextContent(
      'Error! Refresh and try again.'
    );
    expect(queryByTestId('no-users-text')).not.toBeInTheDocument();
    expect(queryByTestId('create-user-button')).not.toBeInTheDocument();
    expect(queryByTestId('users-table')).not.toBeInTheDocument();
    expect(queryByTestId('create-user-modal')).not.toBeInTheDocument();
    expect(queryByTestId('update-user-modal')).not.toBeInTheDocument();
    expect(queryByTestId('delete-user-modal')).not.toBeInTheDocument();
  });
});

describe('creating a user', () => {
  test('resulting in success', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      newUser,
      clickCreateUserButton,
      fillOutUserFormForMethod,
      clickSubmitButton,
      assertUsersTableCount,
      assertUserInUsersTable
    } = await renderRoot();

    // queue subsequent api responses
    mockAdapter.onPost('/users').replyOnce(201);
    mockAdapter.onGet('/users').reply(200, [...users, newUser]);

    // open create user modal
    clickCreateUserButton();

    // assert create user modal is open
    expect(getByTestId('create-user-modal')).toBeInTheDocument();

    // fill out create user form
    fillOutUserFormForMethod('create', newUser);

    // submit create user form
    clickSubmitButton();

    // wait for create user modal to close (subsequent api responses complete)
    await wait(() =>
      expect(queryByTestId('create-user-modal')).not.toBeInTheDocument()
    );

    // assert success message
    expect(getByTestId('alert-success')).toHaveTextContent(
      'User "usertwo" created successfully.'
    );

    // assert users table is rerendered with new user
    assertUsersTableCount(users.length + 1);
    assertUserInUsersTable(newUser);
  });

  test('resulting in error', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      existingUser,
      clickCreateUserButton,
      fillOutUserFormForMethod,
      clickSubmitButton,
      clickCancelButton,
      assertUsersTableCount
    } = await renderRoot();

    // queue subsequent api responses (simulating conflict)
    mockAdapter
      .onPost('/users')
      .replyOnce(409, 'User already exists with username.');
    mockAdapter.onGet('/users').reply(200, users);

    // open create user modal
    clickCreateUserButton();

    // assert create user modal is open
    expect(getByTestId('create-user-modal')).toBeInTheDocument();

    // fill out create user form
    fillOutUserFormForMethod('create', existingUser);

    // submit create user form
    clickSubmitButton();

    // assert error message (subsequent api responses complete)
    await wait(() =>
      expect(getByTestId('alert-danger')).toHaveTextContent(
        'Unable to create user "userone". User already exists with username.'
      )
    );

    // assert create user moadl is still open
    expect(queryByTestId('create-user-modal')).toBeInTheDocument();

    // close create user modal
    clickCancelButton();

    // assert create user modal is closed
    await wait(() =>
      expect(queryByTestId('create-user-modal')).not.toBeInTheDocument()
    );

    // assert users table is rendered
    assertUsersTableCount(users.length);
  });
});

describe('updating a user', () => {
  test('resulting in success', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      updatedUser,
      clickUpdateUserButton,
      fillOutUserFormForMethod,
      clickSubmitButton,
      assertUsersTableCount,
      assertUserInUsersTable
    } = await renderRoot();

    // queue subsequent api responses
    mockAdapter.onPut(`/users/${updatedUser.id}`).replyOnce(200);
    mockAdapter
      .onGet('/users')
      .reply(200, [
        ...users.filter(user => user.id !== updatedUser.id),
        updatedUser
      ]);

    // open update user modal
    clickUpdateUserButton(updatedUser.id);

    // assert update user modal is open
    expect(getByTestId('update-user-modal')).toBeInTheDocument();

    // fill out update user form
    fillOutUserFormForMethod('update', { username: updatedUser.username });

    // submit update user form
    clickSubmitButton();

    // wait for update user modal to close (subsequent api responses complete)
    await wait(() =>
      expect(queryByTestId('update-user-modal')).not.toBeInTheDocument()
    );

    // assert success message
    expect(getByTestId('alert-success')).toHaveTextContent(
      'User "updatedusertwo" updated successfully.'
    );

    // assert users table is rerendered with updated user
    assertUsersTableCount(users.length);
    assertUserInUsersTable(updatedUser);
  });

  test('resulting in error', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      updatedUser,
      clickUpdateUserButton,
      fillOutUserFormForMethod,
      clickSubmitButton,
      clickCancelButton,
      assertUsersTableCount
    } = await renderRoot();

    // queue subsequent api responses (simulating validation failure)
    mockAdapter.onPut(`/users/${updatedUser.id}`).replyOnce(422, {
      errors: ['Validation failed']
    });
    mockAdapter.onGet('/users').reply(200, users);

    // open update user modal
    clickUpdateUserButton(updatedUser.id);

    // assert update user modal is open
    expect(getByTestId('update-user-modal')).toBeInTheDocument();

    // fill out update user form
    fillOutUserFormForMethod('update', { username: updatedUser.username });

    // submit update user form
    clickSubmitButton();

    // assert error message (subsequent api responses complete)
    await wait(() =>
      expect(getByTestId('alert-danger')).toHaveTextContent(
        'Unable to update user "userone". Errors: Validation failed.'
      )
    );

    // assert update user moadl is still open
    expect(queryByTestId('update-user-modal')).toBeInTheDocument();

    // close update user modal
    clickCancelButton();

    // assert update user modal is closed
    await wait(() =>
      expect(queryByTestId('update-user-modal')).not.toBeInTheDocument()
    );

    // assert users table is rendered
    assertUsersTableCount(users.length);
  });
});

describe('deleting a user', () => {
  test('resulting in success', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      existingUser,
      clickDeleteUserButton,
      clickSubmitButton,
      assertUsersTableCount
    } = await renderRoot();

    // queue subsequent api responses
    mockAdapter.onDelete(`/users/${existingUser.id}`).replyOnce(204);
    mockAdapter
      .onGet('/users')
      .reply(200, [...users.filter(user => user.id !== existingUser.id)]);

    // open delete user modal
    clickDeleteUserButton(existingUser.id);

    // assert update user modal is open
    expect(getByTestId('delete-user-modal')).toBeInTheDocument();

    // assert delete user confirmation text
    expect(getByTestId('delete-user-confirmation-text')).toHaveTextContent(
      'Are you sure you want to delete "userone"?'
    );

    // confirm delete user
    clickSubmitButton();

    // wait for delete user modal to close (subsequent api responses complete)
    await wait(() =>
      expect(queryByTestId('delete-user-modal')).not.toBeInTheDocument()
    );

    // assert success message
    expect(getByTestId('alert-success')).toHaveTextContent(
      'User "userone" deleted successfully.'
    );

    // assert users table is rerendered without deleted user
    assertUsersTableCount(users.length - 1);
  });

  test('resulting in error', async () => {
    const {
      getByTestId,
      queryByTestId,
      users,
      existingUser,
      clickDeleteUserButton,
      clickSubmitButton,
      assertUsersTableCount
    } = await renderRoot();

    // queue subsequent api responses (simulating user already deleted)
    mockAdapter.onDelete(`/users/${existingUser.id}`).replyOnce(404);
    mockAdapter
      .onGet('/users')
      .reply(200, [...users.filter(user => user.id !== existingUser.id)]);

    // open delete user modal
    clickDeleteUserButton(existingUser.id);

    // assert update user modal is open
    expect(getByTestId('delete-user-modal')).toBeInTheDocument();

    // assert delete user confirmation text
    expect(getByTestId('delete-user-confirmation-text')).toHaveTextContent(
      'Are you sure you want to delete "userone"?'
    );

    // submit delete user
    clickSubmitButton();

    // wait for delete user modal to close (subsequent api responses complete)
    await wait(() =>
      expect(queryByTestId('delete-user-modal')).not.toBeInTheDocument()
    );

    // assert error message
    expect(getByTestId('alert-danger')).toHaveTextContent(
      'Unable to delete user "userone". User does not exist.'
    );

    // assert users table is rerendered
    assertUsersTableCount(users.length - 1);
  });
});
