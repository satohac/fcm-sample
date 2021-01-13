importScripts("/__/firebase/8.2.2/firebase-app.js");
importScripts("/__/firebase/8.2.2/firebase-messaging.js");
importScripts("/__/firebase/init.js");

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage(payload);
      });
    });
});
