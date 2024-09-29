const Subscription = require('../models/Subscription');
const User = require('../models/User');

exports.createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const user = req.user;

    // Calcula la fecha de finalización (por ejemplo, 30 días desde hoy)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const subscription = new Subscription({
      user: user._id,
      plan,
      endDate
    });

    await subscription.save();

    // Actualiza el estado de suscripción del usuario
    user.subscribed = true;
    await user.save();

    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({ user: user._id, active: true });

    if (!subscription) {
      return res.status(404).json({ message: 'Suscripción activa no encontrada' });
    }

    subscription.active = false;
    await subscription.save();

    user.subscribed = false;
    await user.save();

    res.json({ message: 'Suscripción cancelada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
