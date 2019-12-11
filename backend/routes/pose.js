const express = require('express');

const PoseController = require('../controllers/pose');

const router = express.Router();

router.post('', PoseController.savePose);

module.exports = router;