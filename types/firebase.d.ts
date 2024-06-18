// types/firebase.d.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

declare module '#app' {
    interface NuxtApp {
        $firebase: {
            auth: firebase.auth.Auth;
            database: firebase.database.Database;
        };
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $firebase: {
            auth: firebase.auth.Auth;
            database: firebase.database.Database;
        };
    }
}
