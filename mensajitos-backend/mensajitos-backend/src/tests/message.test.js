const request = require('supertest');
const app = require('../server'); // Asegúrate de exportar la app en server.js
const mongoose = require('mongoose');

beforeAll(async () => {
  // Conectar a una base de datos de prueba
  await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
  // Cerrar la conexión después de las pruebas
  await mongoose.connection.close();
});

describe('Pruebas de mensajes', () => {
  it('debería obtener todos los mensajes', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBeTruthy();
  });

  // Añade más pruebas aquí
});
