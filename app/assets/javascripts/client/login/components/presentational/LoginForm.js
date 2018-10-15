import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const LoginForm = () => (
  <Form action="/login" method="post">
    <FormGroup>
      <Label for="username">Username</Label>
      <Input
        autoFocus
        type="text"
        name="username"
        id="username"
        placeholder="enter username"
      />
    </FormGroup>
    <FormGroup>
      <Label for="password">Password</Label>
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="enter password"
      />
    </FormGroup>
    <Button color="secondary">Submit</Button>
  </Form>
);

export default LoginForm;
