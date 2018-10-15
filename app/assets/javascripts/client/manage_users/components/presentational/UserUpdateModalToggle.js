import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import VisibilityToggle from '../utility/VisibilityToggle';
import UserUpdateFormContainer from '../container/UserUpdateFormContainer';
import { userType } from '../../constants/types';

const UserUpdateModalToggle = ({ user }) => {
  const { username } = user;

  return (
    <VisibilityToggle>
      {({ isOpen, toggleVisibility }) => (
        <React.Fragment>
          <Button
            outline
            color="secondary"
            size="sm"
            title={`Update ${username}`}
            onClick={toggleVisibility}
          >
            Update
          </Button>
          <Modal isOpen={isOpen} backdrop="static">
            <div className="modal-header">
              <h5 className="lead">Update User</h5>
            </div>
            <ModalBody>
              <UserUpdateFormContainer
                user={user}
                cleanupForm={toggleVisibility}
              />
            </ModalBody>
          </Modal>
        </React.Fragment>
      )}
    </VisibilityToggle>
  );
};

UserUpdateModalToggle.propTypes = {
  user: userType.isRequired
};

export default UserUpdateModalToggle;
