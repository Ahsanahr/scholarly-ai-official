const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'trazo-scholarly' });
console.log('Apps:', admin.apps.length);
try {
  const db = admin.firestore();
  console.log('Type of collection:', typeof db.collection);
} catch (e) {
  console.error('Error:', e.message);
}
