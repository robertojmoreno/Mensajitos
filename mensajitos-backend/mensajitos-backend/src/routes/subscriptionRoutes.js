const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, subscriptionController.createSubscription);
router.post('/cancel', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;
