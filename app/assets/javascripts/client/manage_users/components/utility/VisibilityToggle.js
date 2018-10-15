import PropTypes from 'prop-types';
import { Component } from 'react';

class VisibilityToggle extends Component {
  state = {
    isOpen: false
  };

  toggleVisibility = () =>
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));

  render() {
    return this.props.children({
      ...this.state,
      toggleVisibility: this.toggleVisibility
    });
  }
}

VisibilityToggle.propTypes = {
  children: PropTypes.func.isRequired
};

export default VisibilityToggle;
