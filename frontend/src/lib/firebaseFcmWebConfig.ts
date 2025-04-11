/* *** FCM module for Mobile Apps **** */
import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";

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

// Only initialize Firebase Web Messaging if running in a browser
let messaging: Messaging | undefined;
if (Capacitor.getPlatform() === "web") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { messaging };
