// plugins/firebase.ts

import { defineNuxtPlugin } from '#app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

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

    nuxtApp.provide('firebase', { auth, database });
});
