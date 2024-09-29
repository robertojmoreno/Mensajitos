const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', authMiddleware, categoryController.updateCategory);

module.exports = router;
