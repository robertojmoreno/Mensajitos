const admin = require('../config/firebaseConfig').admin;
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.sendNotification = async (recipientId, type, content, relatedUserId = null, relatedMessageId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedUser: relatedUserId,
      relatedMessage: relatedMessageId
    });

    await notification.save();

    const recipient = await User.findById(recipientId);
    if (recipient && recipient.fcmToken) {
      const message = {
        notification: {
          title: 'Nuevo ' + type,
          body: content,
        },
        token: recipient.fcmToken,
      };

      await admin.messaging().send(message);
    }

    return notification;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('relatedUser', 'name')
      .populate('relatedMessage', 'content');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};