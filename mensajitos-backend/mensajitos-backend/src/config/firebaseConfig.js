const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: './src/config/serviceAccountKey.json'
});

const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

module.exports = { admin, bucket };
