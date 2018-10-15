import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import VisibilityToggle from '../utility/VisibilityToggle';
import UserCreateFormContainer from '../container/UserCreateFormContainer';

const UserCreateModalToggle = () => (
  <VisibilityToggle>
    {({ isOpen, toggleVisibility }) => (
      <React.Fragment>
        <Button
          outline
          color="success"
          size="sm"
          title="Create a new user"
          onClick={toggleVisibility}
        >
          Create
        </Button>
        <Modal isOpen={isOpen} backdrop="static">
          <div className="modal-header">
            <h5 className="lead">Create User</h5>
          </div>
          <ModalBody>
            <UserCreateFormContainer cleanupForm={toggleVisibility} />
          </ModalBody>
        </Modal>
      </React.Fragment>
    )}
  </VisibilityToggle>
);

export default UserCreateModalToggle;
