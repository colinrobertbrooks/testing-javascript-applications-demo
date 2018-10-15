/* eslint-disable global-require */
const express = require('express');

const loginRoutes = require('./login');
const logoutRoutes = require('./logout');
const apiRoutes = require('./api');
const adminRoutes = require('./admin');
const featuresRoutes = require('./features');
const indexController = require('../controllers/views');

let getNavbarHTML;

if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line import/no-unresolved
  getNavbarHTML = require('../../private/getNavbarHTML');
} else {
  getNavbarHTML = require('../assets/javascripts/server/getNavbarHTML');
}

let getFooterHTML;

if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line import/no-unresolved
  getFooterHTML = require('../../private/getFooterHTML');
} else {
  getFooterHTML = require('../assets/javascripts/server/getFooterHTML');
}

const router = express.Router();

router.use((req, res, next) => {
  const navbarProps = {
    user: req.user
  };

  res.locals.navbarHTML = getNavbarHTML(navbarProps);
  res.locals.navbarProps = JSON.stringify(navbarProps);

  const footerProps = {
    user: req.user
  };

  res.locals.footerHTML = getFooterHTML(footerProps);
  res.locals.footerProps = JSON.stringify(footerProps);

  next();
});

router.use('/login', loginRoutes);

router.use('/logout', logoutRoutes);

router.use('/api', apiRoutes);

router.use('/admin', adminRoutes);

router.use('/features', featuresRoutes);

router.get('/', indexController.get);

module.exports = router;
