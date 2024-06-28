import { initializeApp } from "firebase/app";
import { getFirestore,addDoc,getDoc,collection,doc,setDoc,onSnapshot,updateDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCf5EUT4cxtHsSUCcOwKyz68iV_CgF5V9Y",
    authDomain: "codeblitz-63af7.firebaseapp.com",
    projectId: "codeblitz-63af7",
    storageBucket: "codeblitz-63af7.appspot.com",
    messagingSenderId: "994338936273",
    appId: "1:994338936273:web:119ce6f92276c896e4fcf0",
    measurementId: "G-Y7JNLDHRMZ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export {db,doc,setDoc,onSnapshot,updateDoc,collection,getDoc,addDoc}