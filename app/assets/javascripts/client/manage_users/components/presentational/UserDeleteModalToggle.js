import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import VisibilityToggle from '../utility/VisibilityToggle';
import { userType } from '../../constants/types';

const UserDeleteModalToggle = ({ user, getAccessName, deleteUser }) => {
  const { id: userId, username, access } = user;
  const userHasAdminAccess = !!access.find(id => getAccessName(id) === 'Admin');

  return (
    <VisibilityToggle>
      {({ isOpen, toggleVisibility }) => (
        <React.Fragment>
          <Button
            outline
            color="danger"
            size="sm"
            title={
              userHasAdminAccess
                ? 'Cannot delete a user with Admin access'
                : `Delete ${username}`
            }
            disabled={userHasAdminAccess}
            onClick={toggleVisibility}
            data-testid={`delete-user-${userId}`}
          >
            Delete
          </Button>
          <Modal
            isOpen={isOpen}
            backdrop="static"
            data-testid="delete-user-modal"
          >
            <div className="modal-header">
              <h5 className="lead">Delete User</h5>
            </div>
            <ModalBody>
              <p data-testid="delete-user-confirmation-text">
                Are you sure you want to delete &quot;
                {username}
                &quot;?
              </p>
              <Button
                outline
                color="danger"
                size="sm"
                onClick={() => {
                  toggleVisibility();
                  setTimeout(() => deleteUser(user), 300);
                }}
              >
                Submit
              </Button>{' '}
              <Button
                outline
                color="secondary"
                size="sm"
                onClick={toggleVisibility}
              >
                Cancel
              </Button>
            </ModalBody>
          </Modal>
        </React.Fragment>
      )}
    </VisibilityToggle>
  );
};

UserDeleteModalToggle.propTypes = {
  user: userType.isRequired,
  getAccessName: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default UserDeleteModalToggle;
