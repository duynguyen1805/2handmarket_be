// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApVos6lNtrTyjPgiNm-7kDox3Jyrna7r4",
  authDomain: "send-otp-73fc9.firebaseapp.com",
  databaseURL:
    "https://send-otp-73fc9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "send-otp-73fc9",
  storageBucket: "send-otp-73fc9.appspot.com",
  messagingSenderId: "72321659648",
  appId: "1:72321659648:web:073139c719829487bdf9e5",
  measurementId: "G-H3Q02ETT51",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
module.export = { auth, firebase };
