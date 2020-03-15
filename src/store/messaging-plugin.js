import axios from "axios";
import firebase from "firebase";

import router from "../router";
import {
  ACTION_DOWNLOAD_NEW_EXPOSE,
  MUTATION_SET_AUTH_TOKEN,
  MUTATION_SET_PUSH_TOKEN,
  MUTATION_SET_MESSAGING_ERROR,
  MUTATION_ADD_RECEIVED_NEW_NOTIFICATION
} from "./constants";

firebase.initializeApp({
  messagingSenderId: process.env.VUE_APP_FIREBASE_SERVER_ID,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET
});

const messaging = firebase.messaging();

const sendTokenToServer = (store, token) =>
  axios({
    method: "POST",
    url: `${process.env.VUE_APP_API_ENDPOINT}/api/push/subscribe`,
    data: { token, oldToken: store.getters.pushToken },
    headers: {
      Authorization: `Bearer ${store.getters.authToken}`
    }
  });

const createFCM = store => {
  if (!store.getters.pushToken) {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then(token =>
        sendTokenToServer(store, token).then(() => {
          localStorage.setItem("pushToken", token);
          store.commit(MUTATION_SET_PUSH_TOKEN, token);
        })
      )
      .catch(error => store.commit(MUTATION_SET_MESSAGING_ERROR, error.code));
  }

  messaging.onMessage(payload => {
    const notificationData = JSON.parse(payload.data.notification);
    const notification = new Notification(notificationData.title, {
      body: notificationData.body,
      requireInteraction: true
    });

    store.commit(MUTATION_ADD_RECEIVED_NEW_NOTIFICATION, {
      title: notificationData.title,
      exposeId: notificationData.data.exposeId
    });

    store.dispatch(ACTION_DOWNLOAD_NEW_EXPOSE, notificationData.data.exposeId);

    notification.onclick = () => {
      notification.close();
      router.push(`/${notificationData.data.exposeId}`);
    };
  });

  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken =>
        sendTokenToServer(store, refreshedToken).then(() => {
          localStorage.setItem("pushToken", refreshedToken);
          store.commit(MUTATION_SET_PUSH_TOKEN, refreshedToken);
        })
      )
      .catch(error => {
        store.commit(MUTATION_SET_MESSAGING_ERROR, error.code);
      });
  });
};

const createFCMPlugin = () => store => {
  if (!store.getters.isAuthenticated) {
    store.subscribe(mutation => {
      if (mutation.type === MUTATION_SET_AUTH_TOKEN) {
        createFCM(store);
      }
    });

    return;
  }

  createFCM(store);
};

export default createFCMPlugin;
