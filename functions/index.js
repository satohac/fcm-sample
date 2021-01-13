const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();

exports.registToken = functions.database
  .ref("/users/{uid}/fcmToken")
  .onCreate((snapshot, context) => {
    const token = snapshot.val();
    functions.logger.log(`[subscribe]${token} to all`);
    return admin.messaging().subscribeToTopic(token, "/topics/all");
  });

exports.deleteToken = functions.database
  .ref("/users/{uid}/fcmToken")
  .onDelete((snapshot, context) => {
    const token = snapshot.val();
    functions.logger.log(`[unsubscribe]${token} from all`);
    return admin.messaging().unsubscribeFromTopic(token, "/topics/all");
  });

exports.subscribeToTopic = functions.database
  .ref("/users/{uid}/subscribes/{topic}")
  .onCreate((snapshot, context) => {
    const topic = context.params.topic;
    const uid = context.params.uid;
    return admin
      .database()
      .ref(`users/${uid}/fcmToken`)
      .get()
      .then((tokenSnap) => {
        const token = tokenSnap.val();
        functions.logger.log(`[subscribe]${token} to ${topic}`);
        return admin.messaging().subscribeToTopic(token, `/topics/${topic}`);
      })
      .catch(console.error);
  });

exports.unsubscribeFromTopic = functions.database
  .ref("/users/{uid}/subscribes/{topic}")
  .onDelete((snapshot, context) => {
    const topic = context.params.topic;
    const uid = context.params.uid;
    return admin
      .database()
      .ref(`users/${uid}/fcmToken`)
      .get()
      .then((tokenSnap) => {
        const token = tokenSnap.val();
        functions.logger.log(`[unsubscribe]${token} from ${topic}`);
        return admin
          .messaging()
          .unsubscribeFromTopic(token, `/topics/${topic}`);
      })
      .catch(console.error);
  });
