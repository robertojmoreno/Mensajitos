const User = require('../models/User');
const admin = require('../config/firebaseConfig');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Crear usuario en Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });

    // Crear usuario en nuestra base de datos
    const user = new User({
      name: name,
      email: email,
      firebaseUid: userRecord.uid
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  // Firebase maneja la autenticación en el cliente, 
  // aquí solo necesitamos verificar el token
  res.json({ message: 'Inicio de sesión exitoso' });
};
