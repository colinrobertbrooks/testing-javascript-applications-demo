const express = require('express');
const passport = require('passport');

const loginController = require('../../controllers/authentication/login')(
  passport
);

const router = express.Router();

router.get('/', loginController.get);

router.post('/', loginController.post);

module.exports = router;
