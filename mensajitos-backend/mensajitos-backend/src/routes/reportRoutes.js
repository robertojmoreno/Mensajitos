const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reportController.createReport);
router.get('/', authMiddleware, reportController.getReports);
router.put('/:id', authMiddleware, reportController.updateReportStatus);

module.exports = router;
