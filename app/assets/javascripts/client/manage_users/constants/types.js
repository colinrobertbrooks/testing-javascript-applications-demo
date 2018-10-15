import PropTypes from 'prop-types';

export const colorType = PropTypes.oneOf([
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark'
]);

export const alertType = PropTypes.shape({
  color: colorType.isRequired,
  message: PropTypes.string.isRequired
});

export const accessType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
});

export const userType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  access: PropTypes.arrayOf(PropTypes.number).isRequired
});

export const userFormValuesType = PropTypes.shape({
  username: PropTypes.string,
  access: PropTypes.arrayOf(PropTypes.number),
  password: PropTypes.string
});
