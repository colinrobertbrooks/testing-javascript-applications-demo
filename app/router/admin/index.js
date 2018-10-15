const express = require('express');

const manageUsersController = require('../../controllers/views/manage_users');

const router = express.Router();

router.get('/manage-users', manageUsersController.get);

module.exports = router;
