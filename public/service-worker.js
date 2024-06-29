// service-worker.js

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

self.addEventListener('push', event => {
    const data = event.data.json();
    const title = data.title || 'Course Notification';
    const options = {
        body: data.body || 'You have a new course notification.',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://newgas.vercel.app/todo')
    );
});
