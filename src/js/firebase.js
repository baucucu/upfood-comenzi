import { firebase } from '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyA-EYxcQ5e_yGIMzLz7VMk-eSVNwjuhc0g",
  authDomain: "ecwid-demo-store.firebaseapp.com",
  projectId: "ecwid-demo-store",
  storageBucket: "ecwid-demo-store.appspot.com",
  messagingSenderId: "1011131728037",
  appId: "1:1011131728037:web:175b41db4a0d2032964d4c"
};

firebase.initializeApp(firebaseConfig);

export default firebase;