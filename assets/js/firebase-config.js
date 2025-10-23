// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAy1a4Mr-fMwkj890wOcYBiIFN7Fo2u4CE",
  authDomain: "student-teacher-booking-4e97a.firebaseapp.com",
  projectId: "student-teacher-booking-4e97a",
  storageBucket: "student-teacher-booking-4e97a.appspot.com",
  messagingSenderId: "884877140395",
  appId: "1:884877140395:web:769ebcc15d72d5e151f2ee",
  measurementId: "G-DEMXX6016T"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();