import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth,

  GoogleAuthProvider,

  signInWithPopup

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const firebaseConfig = {

  apiKey: "AIzaSyB1eFWxsEoKzksJ43kKZcr4GosmwU4etWw",

  authDomain: "site-clube-escolar-ael.firebaseapp.com",

  projectId: "site-clube-escolar-ael",

  storageBucket: "site-clube-escolar-ael.firebasestorage.app",

  messagingSenderId: "358819384973",

  appId: "1:358819384973:web:788dba83f5bf4eb3b49cc4",

  measurementId: "G-Q2LYVXJJ47"

};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();



const loginBtn = document.getElementById("loginBtn");

const userDiv = document.getElementById("user");



if(loginBtn){

  loginBtn.addEventListener("click", async () => {

    try{

      const result = await signInWithPopup(auth, provider);

      const user = result.user;



      userDiv.innerHTML = `

        <h2>${user.displayName}</h2>

        <p>${user.email}</p>

        <img src="${user.photoURL}" width="120">

      `;



    } catch(error){

      console.error(error);

      alert("Erro no login: " + error.message);

    }

  });

}