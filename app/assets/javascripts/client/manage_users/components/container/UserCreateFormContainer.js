import PropTypes from 'prop-types';
import React from 'react';
import { Formik } from 'formik';

import { Consumer } from '../../context';
import withAlert from '../utility/withAlert';
import Alert from '../presentational/Alert';
import UserFormContainer from './UserFormContainer';
import { getErrorDescription } from '../../helpers/errors';
import { userCreateValidationSchema } from '../../constants/validations';
import { alertType } from '../../constants/types';

const UserCreateFormContainer = ({
  alert,
  setAlert,
  clearAlert,
  cleanupForm
}) => (
  <Consumer>
    {({ createUser }) => (
      <Formik
        initialValues={{ username: '', access: [], password: '' }}
        validationSchema={userCreateValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          clearAlert();

          try {
            await createUser(values);

            cleanupForm();
          } catch (err) {
            setSubmitting(false);
            setAlert({
              color: 'danger',
              message: `Unable to create user "${
                values.username
              }". ${getErrorDescription(err, 'User')}`
            });
          }
        }}
      >
        {formikProps => (
          <React.Fragment>
            {alert && <Alert {...alert} />}
            <UserFormContainer
              {...formikProps}
              method="create"
              handleCancel={cleanupForm}
            />
          </React.Fragment>
        )}
      </Formik>
    )}
  </Consumer>
);

UserCreateFormContainer.propTypes = {
  alert: alertType,
  setAlert: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  cleanupForm: PropTypes.func.isRequired
};

UserCreateFormContainer.defaultProps = {
  alert: null
};

export default withAlert(UserCreateFormContainer);
