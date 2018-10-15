/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const userType = PropTypes.shape({
  username: PropTypes.string.isRequired,
  access: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
});
