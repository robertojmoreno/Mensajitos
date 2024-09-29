const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/avatar', authMiddleware, upload, userController.uploadAvatar);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/role', authMiddleware, userController.updateRole);
router.put('/deactivate', authMiddleware, userController.deactivateAccount);
router.put('/suspend', authMiddleware, userController.suspendUser);
router.put('/unsuspend', authMiddleware, userController.unsuspendUser);

module.exports = router;
