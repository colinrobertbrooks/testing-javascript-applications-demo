import PropTypes from 'prop-types';
import React from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Form } from 'formik';

import UserFormErrorMessage from './UserFormErrorMessage';
import { accessType, userFormValuesType } from '../../constants/types';

const UserForm = ({
  accessOptions,
  method,
  handleCancel,
  // formik props...
  values,
  setFieldValue,
  isSubmitting,
  handleChange,
  handleBlur
}) => (
  <Form>
    <FormGroup>
      <Label for="username">Username</Label>
      <Input
        type="text"
        id="username"
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <UserFormErrorMessage name="username" />
    </FormGroup>
    <FormGroup>
      <Label for="access">Access</Label>
      <Input
        type="select"
        multiple
        id="access"
        name="access"
        value={values.access}
        onChange={e =>
          setFieldValue(
            'access',
            [...e.target.options]
              .filter(({ selected }) => selected)
              .map(({ value }) => Number(value))
          )
        }
        onBlur={handleBlur}
      >
        {accessOptions.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Input>
      <UserFormErrorMessage name="access" />
    </FormGroup>
    <FormGroup>
      <Label for="password">
        {method === 'update' ? 'New ' : null} Password
      </Label>
      <Input
        type="text"
        id="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <UserFormErrorMessage name="password" />
    </FormGroup>
    <Button
      type="submit"
      outline
      color="success"
      size="sm"
      disabled={isSubmitting}
    >
      Submit
    </Button>{' '}
    <Button
      outline
      color="danger"
      size="sm"
      onClick={handleCancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
  </Form>
);

UserForm.propTypes = {
  accessOptions: PropTypes.arrayOf(accessType).isRequired,
  method: PropTypes.oneOf(['create', 'update']).isRequired,
  handleCancel: PropTypes.func.isRequired,
  // ...formikProps
  values: userFormValuesType.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired
};

export default UserForm;
