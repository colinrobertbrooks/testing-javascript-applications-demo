export const getErrorCode = err => err.response.status;

export const getErrorDescription = (err, resource = 'Resource') => {
  switch (getErrorCode(err)) {
    case 404:
      return `${resource} does not exist.`;

    case 409:
      return err.response.data;

    case 422:
      return `Errors: ${err.response.data.errors.join(', ')}.`;

    default:
      return '';
  }
};
