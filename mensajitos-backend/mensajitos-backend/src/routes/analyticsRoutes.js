const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/platform-stats', authMiddleware, analyticsController.getPlatformStats);
router.get('/creator-stats/:id', authMiddleware, analyticsController.getCreatorStats);
router.get('/content-trends', authMiddleware, analyticsController.getContentTrends);
router.get('/user-engagement', authMiddleware, analyticsController.getUserEngagement);
router.get('/top-creators', authMiddleware, analyticsController.getTopCreators);
router.get('/most-active-users', authMiddleware, analyticsController.getMostActiveUsers);
router.get('/featured', authMiddleware, analyticsController.getFeatured);
router.get('/weekly-top-creators', authMiddleware, analyticsController.getWeeklyTopCreators);
router.post('/update-user-badges', authMiddleware, analyticsController.updateUserBadges);

module.exports = router;
