// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD-pOsvvcXBTuFcPo14vM7YbmpTV0DM8g0",
    authDomain: "newgas-d9d01.firebaseapp.com",
    projectId: "newgas-d9d01",
    storageBucket: "newgas-d9d01.appspot.com",
    messagingSenderId: "271282040066",
    appId: "1:271282040066:web:1782fdbad081cb930c261b",
    measurementId: "G-GGGSPQEBQP",
    databaseURL: "https://newgas-d9d01-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
