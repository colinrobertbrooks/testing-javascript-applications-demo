const express = require('express');

const apiAccessRoutes = require('./access');
const apiUsersRoutes = require('./users');

const router = express.Router();

router.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set({
      CacheControl: 'no-cache',
      Pragma: 'no-cache',
      Expires: '-1'
    });
  }

  next();
});

router.use('/access', apiAccessRoutes);

router.use('/users', apiUsersRoutes);

module.exports = router;
