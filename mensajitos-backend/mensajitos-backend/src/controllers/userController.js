const User = require('../models/User');
const { bucket } = require('../config/firebaseConfig');

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, interests } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, interests },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const file = req.file;
    const fileName = `avatars/${req.user._id}-${Date.now()}.${file.originalname.split('.').pop()}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', () => {
      res.status(500).json({ message: 'Error al subir el avatar' });
    });

    blobStream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: publicUrl },
        { new: true }
      );

      res.json(updatedUser);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-firebaseUid -fcmToken')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    );
    res.json({ message: 'Cuenta desactivada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId, suspensionEndDate, reason } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isSuspended: true,
        suspensionEndDate,
        suspensionReason: reason
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unsuspendUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isSuspended: false,
        suspensionEndDate: null,
        suspensionReason: null
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
