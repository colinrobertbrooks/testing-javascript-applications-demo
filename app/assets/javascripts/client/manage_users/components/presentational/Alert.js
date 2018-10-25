import PropTypes from 'prop-types';
import React from 'react';
import { Alert as ReactstrapAlert } from 'reactstrap';

import { colorType } from '../../constants/types';

const Alert = ({ color, message, close }) => (
  <ReactstrapAlert
    color={color}
    toggle={close}
    className="text-center"
    data-testid={`alert-${color}`}
  >
    {message}
  </ReactstrapAlert>
);

Alert.propTypes = {
  color: colorType.isRequired,
  message: PropTypes.string.isRequired,
  close: PropTypes.func
};

Alert.defaultProps = {
  close: null
};

export default Alert;
