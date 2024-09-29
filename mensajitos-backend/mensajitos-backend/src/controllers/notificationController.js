const admin = require('../config/firebaseConfig');

exports.sendDailyNotification = async (req, res) => {
  try {
    const message = {
      notification: {
        title: '¡Es hora de compartir un mensaje!',
        body: 'No olvides enviar un Mensajito a tus seres queridos hoy.',
      },
      topic: 'daily_reminder',
    };

    const response = await admin.messaging().send(message);
    res.json({ message: 'Notificación enviada', response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};