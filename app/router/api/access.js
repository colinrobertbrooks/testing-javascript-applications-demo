const express = require('express');

const apiAccessController = require('../../controllers/api/access');

const router = express.Router();

router.get('/', apiAccessController.list);

module.exports = router;
