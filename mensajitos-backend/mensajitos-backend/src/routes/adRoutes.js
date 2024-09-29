const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/config', authMiddleware, adController.getAdConfig);
router.put('/config', authMiddleware, adController.updateAdConfig);

module.exports = router;
