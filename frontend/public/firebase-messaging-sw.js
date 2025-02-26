/* *** FCM module for Web App *** */

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

// Base Firebase app configuration.
firebase.initializeApp({
  apiKey: "AIzaSyBhikg7e3foOJVa2rXUQV0KcjEfYfI9olM",
  authDomain: "sportganise-notification-f7c40.firebaseapp.com",
  projectId: "sportganise-notification-f7c40",
  storageBucket: "sportganise-notification-f7c40.firebasestorage.app",
  messagingSenderId: "586630744689",
  appId: "1:586630744689:web:25e075590badb2f09269d0",
  measurementId: "G-QWBV9P289D"
});

const messaging = firebase.messaging();