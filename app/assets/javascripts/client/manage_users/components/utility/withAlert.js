import React, { Component } from 'react';

const withAlert = WrappedComponent => {
  class Wrapper extends Component {
    state = {
      alert: null
    };

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

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          setAlert={this.setAlert}
          clearAlert={this.clearAlert}
        />
      );
    }
  }

  Wrapper.displayName = `withAlert(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return Wrapper;
};

export default withAlert;
