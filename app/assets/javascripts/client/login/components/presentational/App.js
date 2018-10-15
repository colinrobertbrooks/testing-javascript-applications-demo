import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import LoginForm from './LoginForm';

const App = () => (
  <Container>
    <Row>
      <Col sm={12}>
        <h1 className="lead text-center">Log In</h1>
        <hr />
      </Col>
      <Col sm={12} md={{ size: 6, offset: 3 }}>
        <LoginForm />
      </Col>
    </Row>
  </Container>
);

export default App;
