import React from 'react';

import { userType } from '../../../constants/types';

import './Footer.css';

const Footer = ({ user }) => {
  if (user) {
    const { username } = user;

    return (
      <footer data-testid="footer">
        <div className="footer-username">
          Logged in as <strong data-testid="footer-username">{username}</strong>
        </div>
      </footer>
    );
  }

  return null;
};

Footer.propTypes = {
  user: userType
};

Footer.defaultProps = {
  user: null
};

export default Footer;
