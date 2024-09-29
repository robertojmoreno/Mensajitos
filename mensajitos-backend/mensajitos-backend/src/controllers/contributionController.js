const Contribution = require('../models/Contribution');
const User = require('../models/User');

exports.makeContribution = async (req, res) => {
  try {
    const { to, amount, message } = req.body;
    const from = req.user._id;

    const creator = await User.findById(to);
    if (!creator) {
      return res.status(404).json({ message: 'Creador no encontrado' });
    }

    const contribution = new Contribution({
      from,
      to,
      amount,
      message
    });

    await contribution.save();

    // Aquí podrías añadir lógica para procesar el pago real
    // Por ejemplo, usando Stripe o PayPal

    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
