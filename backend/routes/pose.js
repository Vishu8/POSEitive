const express = require('express');

const PoseController = require('../controllers/pose');

const router = express.Router();

router.post('', PoseController.savePose);
router.get('/:userId', PoseController.checkPose);
router.post('/session', PoseController.saveSession);
router.get('/update/:sessionId/:time', PoseController.updateSession);
router.get('/get-session-details/:userId/:time', PoseController.getSessionDetails);

module.exports = router;
