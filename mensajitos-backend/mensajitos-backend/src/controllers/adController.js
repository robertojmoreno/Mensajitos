const AdConfig = require('../models/AdConfig');
const User = require('../models/User');

exports.getAdConfig = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.subscribed) {
      return res.json({ showAd: false });
    }

    const adConfig = await AdConfig.findOne({ active: true });
    if (!adConfig) {
      return res.json({ showAd: false });
    }

    res.json({
      showAd: true,
      adUnitId: adConfig.adUnitId,
      adType: adConfig.adType,
      frequency: adConfig.frequency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAdConfig = async (req, res) => {
  try {
    const { adUnitId, adType, frequency, active } = req.body;
    const adConfig = await AdConfig.findOneAndUpdate(
      {},
      { adUnitId, adType, frequency, active },
      { new: true, upsert: true }
    );
    res.json(adConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.rewardUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Aquí puedes implementar la lógica de recompensa
    // Por ejemplo, dar al usuario créditos o desbloquear contenido premium temporalmente
    user.credits = (user.credits || 0) + 10; // Dar 10 créditos por ver un anuncio
    await user.save();

    res.json({ message: 'Recompensa otorgada', credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
