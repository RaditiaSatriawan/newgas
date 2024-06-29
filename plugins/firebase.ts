import { defineNuxtPlugin } from '#app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/messaging'; // Import messaging module

const firebaseConfig = {
    apiKey: "AIzaSyD-pOsvvcXBTuFcPo14vM7YbmpTV0DM8g0",
    authDomain: "newgas-d9d01.firebaseapp.com",
    projectId: "newgas-d9d01",
    storageBucket: "newgas-d9d01.appspot.com",
    messagingSenderId: "271282040066",
    appId: "1:271282040066:web:1782fdbad081cb930c261b",
    measurementId: "G-GGGSPQEBQP",
    databaseURL: "https://newgas-d9d01-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

export default defineNuxtPlugin(nuxtApp => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const database = firebase.database();
    const messaging = firebase.messaging(); // Initialize messaging

    // Persist user authentication state in localStorage
    auth.onAuthStateChanged(user => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            nuxtApp.provide('user', user);
        } else {
            localStorage.removeItem('user');
            nuxtApp.provide('user', null);
        }
    });

    messaging.onMessage((payload) => {
        console.log('Message received:', payload);
        // Customize notification handling here
    });

    messaging.getToken({ vapidKey: 'your-vapid-key' }).then((currentToken) => {
        if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send the token to your server if needed
        } else {
            console.log('No registration token available.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });

    nuxtApp.provide('firebase', { auth, database });
});
