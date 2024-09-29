const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/make', authMiddleware, contributionController.makeContribution);

module.exports = router;
