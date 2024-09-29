# Mensajitos Backend

Este es el backend para la aplicación Mensajitos, una plataforma para compartir mensajes emocionales y temáticos.

## Configuración

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   MONGODB_URI=tu_uri_de_mongodb
   PORT=3000
   FIREBASE_PROJECT_ID=tu_id_de_proyecto_firebase
   ```
4. Ejecuta el servidor con `npm start`

## Pruebas

Ejecuta las pruebas con `npm test`

## Endpoints principales

- POST /api/auth/register: Registrar un nuevo usuario
- POST /api/auth/login: Iniciar sesión
- GET /api/messages: Obtener todos los mensajes
- POST /api/messages: Crear un nuevo mensaje

Para más detalles sobre los endpoints, consulta la documentación de la API.
