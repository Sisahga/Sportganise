/* *** FCM module for Mobile Apps **** */
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Base Firebase app configuration.
const firebaseConfig = {
  apiKey: "AIzaSyBhikg7e3foOJVa2rXUQV0KcjEfYfI9olM",
  authDomain: "sportganise-notification-f7c40.firebaseapp.com",
  projectId: "sportganise-notification-f7c40",
  storageBucket: "sportganise-notification-f7c40.firebasestorage.app",
  messagingSenderId: "586630744689",
  appId: "1:586630744689:web:25e075590badb2f09269d0",
  measurementId: "G-QWBV9P289D",
};

// Initialize Firebase.
const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging (FCM).
const messaging = getMessaging(app);

export { messaging };
