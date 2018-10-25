/* eslint-disable no-param-reassign */
import { fireEvent } from 'react-testing-library';

export const makeInputChange = ({ element, value }) =>
  fireEvent.change(element, {
    target: {
      value
    }
  });

export const makeSelectMultipleChange = ({ element, values }) => {
  if (values.length) {
    values.forEach(value => {
      const optionIdx = element.querySelector(`option[value="${value}"]`).index;

      element.options[optionIdx].selected = true;
    });
  } else {
    [...element.options].forEach((option, optionIdx) => {
      element.options[optionIdx].selected = false;
    });
  }

  fireEvent.change(element);
};
