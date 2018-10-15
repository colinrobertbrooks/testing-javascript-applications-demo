const express = require('express');

const apiUsersController = require('../../controllers/api/users');

const router = express.Router();

router.get('/', apiUsersController.list);

router.post('/', apiUsersController.create);

router.put('/:id', apiUsersController.update);

router.delete('/:id', apiUsersController.destroy);

module.exports = router;
