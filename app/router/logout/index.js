const express = require('express');

const logoutController = require('../../controllers/authentication/logout');

const router = express.Router();

router.get('/', logoutController.get);

module.exports = router;
