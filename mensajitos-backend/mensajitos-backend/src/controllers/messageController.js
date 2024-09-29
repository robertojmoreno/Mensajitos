const Message = require('../models/Message');
const User = require('../models/User');
const { bucket } = require('../config/firebaseConfig');

exports.getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Message.countDocuments();
    const messages = await Message.find()
      .populate('creator', 'name')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const file = req.file;
    const fileName = Date.now() + '-' + file.originalname;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      res.status(500).json({ message: 'Error al subir el archivo' });
    });

    blobStream.on('finish', async () => {
      // Hacer público el archivo
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      const message = new Message({
        content: req.body.content,
        type: file.mimetype.startsWith('image') ? 'image' : 'video',
        category: req.body.category,
        creator: req.user._id,
        mediaUrl: publicUrl
      });

      await message.save();
      res.status(201).json(message);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Añade más funciones del controlador según sea necesario

exports.getMessagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const messages = await Message.find({ category }).populate('creator', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    message.likes += 1;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.shareMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    message.shares += 1;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const messageId = req.params.id;
    if (!user.favorites.includes(messageId)) {
      user.favorites.push(messageId);
      await user.save();
    }
    res.json({ message: 'Añadido a favoritos' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Añade más funciones del controlador según sea necesario

exports.searchMessages = async (req, res) => {
  try {
    const { query, category } = req.query;
    let searchCriteria = {};

    if (query) {
      searchCriteria.content = { $regex: query, $options: 'i' };
    }

    if (category) {
      searchCriteria.category = category;
    }

    const messages = await Message.find(searchCriteria)
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPersonalizedFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following');
    const followingIds = user.following.map(f => f._id);

    const messages = await Message.find({
      $or: [
        { creator: { $in: followingIds } },
        { category: { $in: user.interests } } // Asumiendo que el usuario tiene un campo de intereses
      ]
    })
    .populate('creator', 'name')
    .sort({ createdAt: -1 })
    .limit(20); // Limitar a 20 mensajes por carga

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
