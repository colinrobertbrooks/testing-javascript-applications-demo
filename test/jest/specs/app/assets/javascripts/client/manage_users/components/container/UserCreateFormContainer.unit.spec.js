import { makeInputChange, makeSelectMultipleChange } from 'form-test-helpers';
import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';

import { Context } from 'app/assets/javascripts/client/manage_users/context';
import UserCreateFormContainer from 'app/assets/javascripts/client/manage_users/components/container/UserCreateFormContainer';

function renderUserCreateFormContainer() {
  // test data
  const accessOptions = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Feature 1' },
    { id: 3, name: 'Feature 2' }
  ];
  const user = {
    username: 'username',
    access: [2, 3],
    password: 'PaS$w@rD'
  };

  // mocks
  const createUserMock = jest.fn();
  const cleanupFormMock = jest.fn();

  // render component
  const rtlUtils = render(
    <Context.Provider value={{ accessOptions, createUser: createUserMock }}>
      <UserCreateFormContainer cleanupForm={cleanupFormMock} />
    </Context.Provider>
  );

  // helper methods
  const fillOutUserCreateForm = values => {
    const usernameInput = rtlUtils.getByLabelText('Username');
    const accessSelect = rtlUtils.getByLabelText('Access');
    const passwordInput = rtlUtils.getByLabelText('Password');

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
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton,
    cleanupFormMock
  };
}

test('username is required', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { access, password } = user;

  // act
  fillOutUserCreateForm({ access, password });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username is required.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('username must be alphanumeric', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { access, password } = user;

  // act
  fillOutUserCreateForm({ username: 'u$ern@me', access, password });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username must be alphanumeric.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('username must be lowercase', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { access, password } = user;

  // act
  fillOutUserCreateForm({ username: 'UsErNamE', access, password });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-username')).toHaveTextContent(
      'Username must be lowercase.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('access is required', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { username, password } = user;

  // act
  fillOutUserCreateForm({ username, password });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-access')).toHaveTextContent(
      'Access is required.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('password is required', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { username, access } = user;

  // act
  fillOutUserCreateForm({ username, access });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-password')).toHaveTextContent(
      'Password is required.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('password must not contain whitespace', async () => {
  // arrange
  const {
    getByTestId,
    user,
    createUserMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();
  const { username, access } = user;

  // act
  fillOutUserCreateForm({ username, access, password: ' PaS$ w@rD ' });
  clickSubmitButton();

  // assert
  await wait(() =>
    expect(getByTestId('user-form-error-message-password')).toHaveTextContent(
      'Password must not contain whitespace.'
    )
  );
  expect(createUserMock).not.toHaveBeenCalled();
});

test('calls createUser with values when submitted', async () => {
  // arrange
  const {
    user,
    createUserMock,
    cleanupFormMock,
    fillOutUserCreateForm,
    clickSubmitButton
  } = renderUserCreateFormContainer();

  // act
  fillOutUserCreateForm(user);
  clickSubmitButton();

  // assert
  await wait(() => expect(cleanupFormMock).toHaveBeenCalledTimes(1));
  expect(createUserMock).toHaveBeenCalledTimes(1);
  expect(createUserMock).toHaveBeenCalledWith(user);
});
