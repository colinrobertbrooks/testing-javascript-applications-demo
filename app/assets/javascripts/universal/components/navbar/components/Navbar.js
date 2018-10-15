import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

import { userType } from '../../../constants/types';

import './Navbar.css';

class AppNavbar extends React.Component {
  state = {
    currentPathname: null,
    isOpen: false
  };

  componentDidMount() {
    this.setState({
      currentPathname: window.location.pathname
    });
  }

  toggle = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  render() {
    const { user } = this.props;
    const { currentPathname, isOpen } = this.state;

    return (
      <Navbar color="light" light expand="sm" fixed="top">
        <NavbarBrand href="/">App</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {user ? (
              <React.Fragment>
                {user.access.includes('Admin') && (
                  <NavItem>
                    <NavLink
                      href="/admin/manage-users"
                      active={currentPathname === '/admin/manage-users'}
                    >
                      Manage Users
                    </NavLink>
                  </NavItem>
                )}
                {user.access.includes('Feature 1') && (
                  <NavItem>
                    <NavLink
                      href="/features/1"
                      active={currentPathname === '/features/1'}
                    >
                      Feature 1
                    </NavLink>
                  </NavItem>
                )}
                {user.access.includes('Feature 2') && (
                  <NavItem>
                    <NavLink
                      href="/features/2"
                      active={currentPathname === '/features/2'}
                    >
                      Feature 2
                    </NavLink>
                  </NavItem>
                )}
                <NavItem>
                  <NavLink href="/logout">Log Out</NavLink>
                </NavItem>
              </React.Fragment>
            ) : (
              <NavItem>
                <NavLink href="/login" active={currentPathname === '/login'}>
                  Log In
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

AppNavbar.propTypes = {
  user: userType
};

AppNavbar.defaultProps = {
  user: null
};

export default AppNavbar;
