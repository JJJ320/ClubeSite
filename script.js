import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth,

  GoogleAuthProvider,

  signInWithPopup,

  onAuthStateChanged,

  signOut

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



function mostrarUsuario(user){

  userDiv.innerHTML = `

    <div class="user-info">

      <img src="${user.photoURL}">

      <span class="user-name">
        ${user.displayName}
      </span>

    </div>

  `;

}



  const logoutBtn = document.getElementById("logoutBtn");



  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

  });

}



if(loginBtn){

  loginBtn.addEventListener("click", async () => {

    try{

      await signInWithPopup(auth, provider);

    }

    catch(error){

      console.error(error);

      alert("Erro no login: " + error.message);

    }

  });

}



onAuthStateChanged(auth, (user) => {

  if(user){

    loginBtn.style.display = "none";

    mostrarUsuario(user);

  }

  else{

    loginBtn.style.display = "block";

    userDiv.innerHTML = "";

  }

});