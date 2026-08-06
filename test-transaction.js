const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'trazo-scholarly' });
const db = admin.firestore();

async function test() {
  try {
    const userRef = db.collection('users').doc('test-uid');
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      console.log('Doc exists?', doc.exists);
    });
  } catch (e) {
    console.error('TRANSACTION ERROR:', e.message);
  }
}
test();
