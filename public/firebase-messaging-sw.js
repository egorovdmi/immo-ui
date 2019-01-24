importScripts("https://www.gstatic.com/firebasejs/5.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.8.0/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "91900985432"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const notification = JSON.parse(payload.data.notification);

  return self.registration.showNotification(notification.title, {
    body: notification.body,
    data: notification.data,
    requireInteraction: true
  });
});

self.addEventListener("notificationclick", function(event) {
  const { url } = event.notification.data;
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // eslint-disable-next-line
  clients.openWindow(url).catch(error => console.log(error));
});
