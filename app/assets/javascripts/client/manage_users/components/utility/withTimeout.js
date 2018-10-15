import React, { Component } from 'react';

const withTimeout = ({
  timeoutMs = 1000,
  onTimeout = () => {
    throw new Error(
      'Missing prop: The prop `onTimeout` is required in `withTimeout`.'
    );
  }
}) => WrappedComponent => {
  class Wrapper extends Component {
    timeout = setTimeout(() => {
      onTimeout({ ...this.props });
    }, timeoutMs);

    componentWillUnmount() {
      clearTimeout(this.timeout);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  Wrapper.displayName = `withTimeout(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return Wrapper;
};

export default withTimeout;
