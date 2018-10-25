/* eslint-disable react/sort-comp */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import axios from 'axios';

import store from './store';
import api from '../api';
import { getErrorDescription } from '../helpers/errors';

const Context = React.createContext();

class Provider extends Component {
  state = store.getState();

  async componentDidMount() {
    if (this.state.isLoading) {
      try {
        const [{ data: accessOptions }, { data: users }] = await axios.all([
          api.access.list(),
          api.users.list()
        ]);

        this.setState({
          isLoading: false,
          hasError: false,
          accessOptions,
          users
        });
      } catch (err) {
        this.setState({
          isLoading: false,
          hasError: true,
          users: null
        });
      }
    }
  }

  componentDidUpdate() {
    // persist state accross hmr events in dev
    if (process.env.NODE_ENV === 'development') {
      store.setState(this.state);
    }
  }

  setAlert = alert => {
    if (this.state.alert) {
      this.setState(
        {
          alert: null
        },
        () => this.setState({ alert })
      );
    } else {
      this.setState({
        alert
      });
    }
  };

  clearAlert = () => {
    if (this.state.alert) {
      this.setState({
        alert: null
      });
    }
  };

  getAccessName = accessId => {
    const access = this.state.accessOptions.find(({ id }) => id === accessId);

    if (access) {
      return access.name;
    }

    return 'Unknown';
  };

  refreshUsers = async () => {
    try {
      const { data: users } = await api.users.list();

      this.setState({
        users
      });
    } catch (err) {
      this.setState({
        hasError: true,
        users: null
      });
    }
  };

  createUser = async userToCreate => {
    try {
      await api.users.create(userToCreate);

      this.setAlert({
        color: 'success',
        message: `User "${userToCreate.username}" created successfully.`
      });
    } finally {
      this.refreshUsers();
    }
  };

  updateUser = async (user, userToUpdate) => {
    try {
      await api.users.update(userToUpdate);

      this.setAlert({
        color: 'success',
        message: `User "${userToUpdate.username}" updated successfully.`
      });
    } finally {
      this.refreshUsers();
    }
  };

  deleteUser = async userToDelete => {
    try {
      await api.users.destroy(userToDelete);

      this.setAlert({
        color: 'success',
        message: `User "${userToDelete.username}" deleted successfully.`
      });
    } catch (err) {
      this.setAlert({
        color: 'danger',
        message: `Unable to delete user "${
          userToDelete.username
        }". ${getErrorDescription(err, 'User')}`
      });
    } finally {
      this.refreshUsers();
    }
  };

  render() {
    const { children } = this.props;

    return (
      <Context.Provider
        value={{
          ...this.state,
          clearAlert: this.clearAlert,
          getAccessName: this.getAccessName,
          createUser: this.createUser,
          updateUser: this.updateUser,
          deleteUser: this.deleteUser
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.element.isRequired
};

const { Consumer } = Context;

export { Context, Provider, Consumer };
