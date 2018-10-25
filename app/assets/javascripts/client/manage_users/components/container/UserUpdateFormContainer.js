import PropTypes from 'prop-types';
import React from 'react';
import { Formik } from 'formik';

import { Consumer } from '../../context';
import withAlert from '../utility/withAlert';
import Alert from '../presentational/Alert';
import UserFormContainer from './UserFormContainer';
import { getErrorDescription } from '../../helpers/errors';
import { userUpdateValidationSchema } from '../../constants/validations';
import { alertType, userType } from '../../constants/types';

const UserUpdateFormContainer = ({
  user,
  cleanupForm,
  // withAlert props...
  alert,
  setAlert,
  clearAlert
}) => (
  <Consumer>
    {({ updateUser }) => {
      const { id, username, access } = user;

      return (
        <Formik
          initialValues={{
            username,
            access,
            password: ''
          }}
          validationSchema={userUpdateValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            clearAlert();

            try {
              await updateUser(user, { id, ...values });

              cleanupForm();
            } catch (err) {
              setSubmitting(false);
              setAlert({
                color: 'danger',
                message: `Unable to update user "${
                  user.username
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
                method="update"
                handleCancel={cleanupForm}
              />
            </React.Fragment>
          )}
        </Formik>
      );
    }}
  </Consumer>
);

UserUpdateFormContainer.propTypes = {
  user: userType.isRequired,
  alert: alertType,
  setAlert: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  cleanupForm: PropTypes.func.isRequired
};

UserUpdateFormContainer.defaultProps = {
  alert: null
};

export default withAlert(UserUpdateFormContainer);
