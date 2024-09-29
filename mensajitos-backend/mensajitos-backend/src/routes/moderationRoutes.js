const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, moderationController.getDashboardStats);
router.get('/recent-reports', authMiddleware, moderationController.getRecentReports);
router.delete('/message', authMiddleware, moderationController.deleteMessage);

module.exports = router;
