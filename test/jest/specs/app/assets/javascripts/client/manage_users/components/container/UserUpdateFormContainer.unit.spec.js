import { makeInputChange, makeSelectMultipleChange } from 'form-test-helpers';
import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';

import { Context } from 'app/assets/javascripts/client/manage_users/context';
import UserUpdateFormContainer from 'app/assets/javascripts/client/manage_users/components/container/UserUpdateFormContainer';

function renderUserUpdateFormContainer() {
  // test data
  const accessOptions = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Feature 1' },
    { id: 3, name: 'Feature 2' }
  ];
  const user = {
    id: 2,
    username: 'username',
    access: [2, 3]
  };
  const updatedUser = {
    ...user,
    username: 'updatedusername',
    password: 'upd&tedPaS$w@rD'
  };

  // mocks
  const updateUserMock = jest.fn();
  const cleanupFormMock = jest.fn();

  // render component
  const rtlUtils = render(
    <Context.Provider value={{ accessOptions, updateUser: updateUserMock }}>
      <UserUpdateFormContainer user={user} cleanupForm={cleanupFormMock} />
    </Context.Provider>
  );

  // helper methods
  const fillOutUserUpdateForm = values => {
    const usernameInput = rtlUtils.getByLabelText('Username');
    const accessSelect = rtlUtils.getByLabelText('Access');
    const passwordInput = rtlUtils.getByLabelText('New Password');

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

  return {
    ...rtlUtils,
    user,
    updatedUser,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton,
    cleanupFormMock
  };
}

test('username is required', async () => {
  // arrange
  const {
    getByTestId,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();

  // act
  fillOutUserUpdateForm({ username: '' });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username is required.'
    )
  );
  expect(updateUserMock).not.toHaveBeenCalled();
});

test('username must be alphanumeric', async () => {
  // arrange
  const {
    getByTestId,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();

  // act
  fillOutUserUpdateForm({ username: 'u$ern@me' });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username must be alphanumeric.'
    )
  );
  expect(updateUserMock).not.toHaveBeenCalled();
});

test('username must be lowercase', async () => {
  // arrange
  const {
    getByTestId,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();

  // act
  fillOutUserUpdateForm({ username: 'UsErNamE' });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username must be lowercase.'
    )
  );
  expect(updateUserMock).not.toHaveBeenCalled();
});

test('access is required', async () => {
  // arrange
  const {
    getByTestId,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();

  // act
  fillOutUserUpdateForm({ access: [] });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-access')).toHaveTextContent(
      'Access is required.'
    )
  );
  expect(updateUserMock).not.toHaveBeenCalled();
});

test('password must not contain whitespace', async () => {
  // arrange
  const {
    getByTestId,
    updateUserMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();

  // act
  fillOutUserUpdateForm({ password: ' PaS$ w@rD ' });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-password')).toHaveTextContent(
      'Password must not contain whitespace.'
    )
  );
  expect(updateUserMock).not.toHaveBeenCalled();
});

test('calls updateUser with user and values when submitted without password', async () => {
  // arrange
  const {
    user,
    updatedUser,
    updateUserMock,
    cleanupFormMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();
  const { username } = updatedUser;

  // act
  fillOutUserUpdateForm({ username });
  clickSubmitButton();

  // assert
  await wait(() => expect(cleanupFormMock).toHaveBeenCalledTimes(1));
  expect(updateUserMock).toHaveBeenCalledTimes(1);
  expect(updateUserMock).toHaveBeenCalledWith(user, {
    ...updatedUser,
    password: ''
  });
});

test('calls updateUser with user and values when submitted with password', async () => {
  // arrange
  const {
    user,
    updatedUser,
    updateUserMock,
    cleanupFormMock,
    fillOutUserUpdateForm,
    clickSubmitButton
  } = renderUserUpdateFormContainer();
  const { username, password } = updatedUser;

  // act
  fillOutUserUpdateForm({ username, password });
  clickSubmitButton();

  // assert
  await wait(() => expect(cleanupFormMock).toHaveBeenCalledTimes(1));
  expect(updateUserMock).toHaveBeenCalledTimes(1);
  expect(updateUserMock).toHaveBeenCalledWith(user, updatedUser);
});
