import PropTypes from 'prop-types';
import React from 'react';
import { ErrorMessage } from 'formik';

const UserFormErrorMessage = ({ name }) => (
  <ErrorMessage name={name}>
    {message => (
      <small
        className="text-danger"
        data-testid={`user-form-error-message-${name}`}
      >
        {message}
      </small>
    )}
  </ErrorMessage>
);

UserFormErrorMessage.propTypes = {
  name: PropTypes.string.isRequired
};

export default UserFormErrorMessage;
