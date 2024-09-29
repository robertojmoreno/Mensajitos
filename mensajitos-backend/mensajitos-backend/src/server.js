const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
// const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notificationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const adRoutes = require('./routes/adRoutes');
const followRoutes = require('./routes/followRoutes');
// Importar el middleware de manejo de errores
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limita cada IP a 100 solicitudes por ventana
});

// Aplicar a todas las solicitudes
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);  
app.use('/api/contributions', contributionRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/follow', followRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Mensajitos' });
});

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(errorHandler);

// Incluir rutas para reportes y categorías
const reportRoutes = require('./routes/reportRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Rutas
app.use('/api/reports', reportRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Mensajitos' });
});

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
