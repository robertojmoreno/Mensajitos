const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', messageController.getAllMessages);
router.post('/', 
  authMiddleware, 
  upload,
  [
    body('content').notEmpty().withMessage('El contenido no puede estar vacío'),
    body('type').isIn(['image', 'video']).withMessage('El tipo debe ser imagen o video'),
    body('category').notEmpty().withMessage('La categoría es requerida')
  ],
  validate,
  messageController.createMessage
);
router.get('/category/:category', messageController.getMessagesByCategory);
router.post('/:id/like', authMiddleware, messageController.likeMessage);
router.post('/:id/share', authMiddleware, messageController.shareMessage);
router.post('/:id/favorite', authMiddleware, messageController.addToFavorites);
router.get('/search', messageController.searchMessages);
router.get('/creator/:id/stats', authMiddleware, messageController.getCreatorStats);

// Añade más rutas según sea necesario

module.exports = router;
