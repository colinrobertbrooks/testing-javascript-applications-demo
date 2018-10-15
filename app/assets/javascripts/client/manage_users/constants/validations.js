import * as Yup from 'yup';

/*
  values
*/
const username = Yup.string()
  .required('Username is required.')
  .matches(/^[a-z0-9]+$/i, 'Username must be alphanumeric.')
  .lowercase('Username must be lowercase.');

const access = Yup.array()
  .of(Yup.number())
  .min(1, 'Access is required.');

const password = Yup.string().matches(
  /^\S*$/,
  'Password must not contain whitespace.'
);

/*
  schemas
*/
export const userCreateValidationSchema = Yup.object({
  username,
  access,
  password: password.required('Password is required.')
}).strict();

export const userUpdateValidationSchema = Yup.object({
  username,
  access,
  password
}).strict();
