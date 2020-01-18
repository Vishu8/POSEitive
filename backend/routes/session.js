const express = require('express');

const SessionController = require('../controllers/session');

const router = express.Router();

router.get('/:userId', SessionController.getSession);

module.exports = router;
