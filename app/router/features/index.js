const express = require('express');

const feature1Controller = require('../../controllers/views/feature_1');
const feature2Controller = require('../../controllers/views/feature_2');

const router = express.Router();

router.get('/1', feature1Controller.get);

router.get('/2', feature2Controller.get);

module.exports = router;
