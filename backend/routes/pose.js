const express = require('express');

const PoseController = require('../controllers/pose');

const router = express.Router();

router.post('', PoseController.savePose);
router.get('/:userId', PoseController.checkPose);
router.post('/session', PoseController.saveSession);
router.get('/update/:sessionId/:time', PoseController.updateSession);
router.get('/get-session-details/:userId/:time', PoseController.getSessionDetails);
router.get('/get-user-coordinates/:userId', PoseController.getUserCoordinates);
router.get('/session/update/:sessionId/:wrongCount', PoseController.updateWrongPosture);

module.exports = router;
