import PropTypes from 'prop-types';
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import AlertWithTimeout from './AlertWithTimeout';
import UserCreateModalToggle from './UserCreateModalToggle';
import UsersTableContainer from '../container/UsersTableContainer';
import { alertType, userType } from '../../constants/types';

const App = ({ isLoading, hasError, users, alert, clearAlert }) => (
  <Container>
    <Row>
      <Col sm={12}>
        <h1 className="lead text-center" data-testid="app-name-text">
          Manage Users
        </h1>
        <hr />
      </Col>
      <Col sm={12}>
        {(() => {
          if (isLoading) {
            return (
              <p
                className="text-muted text-center"
                data-testid="is-loading-text"
              >
                Loading...
              </p>
            );
          }

          if (hasError) {
            return (
              <p
                className="text-danger text-center"
                data-testid="has-error-text"
              >
                Error! Refresh and try again.
              </p>
            );
          }

          return (
            <Row>
              {alert && (
                <Col sm={12}>
                  <AlertWithTimeout {...alert} close={clearAlert} />
                </Col>
              )}
              <Col sm={12} className="text-center" style={{ marginBottom: 10 }}>
                <UserCreateModalToggle />
              </Col>
              <Col sm={12}>
                {users && users.length > 0 ? (
                  <UsersTableContainer />
                ) : (
                  <p
                    className="text-muted text-center"
                    data-testid="no-users-text"
                  >
                    No users.
                  </p>
                )}
              </Col>
            </Row>
          );
        })()}
      </Col>
    </Row>
  </Container>
);

App.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(userType),
  alert: alertType,
  clearAlert: PropTypes.func.isRequired
};

App.defaultProps = {
  users: null,
  alert: null
};

export default App;
