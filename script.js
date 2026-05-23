import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth,

  GoogleAuthProvider,

  signInWithPopup,

  onAuthStateChanged,

  signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

  getFirestore,

  doc,

  setDoc,

  getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



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

const db = getFirestore(app);



const provider = new GoogleAuthProvider();



const loginBtn = document.getElementById("loginBtn");

const userDiv = document.getElementById("user");

const roleSelect = document.getElementById("roleSelect");

const codeInput = document.getElementById("codeInput");



const LEADER_CODE = "LIDER779";

const DIRECTOR_CODE = "Acesso0255";



codeInput.style.display = "none";



roleSelect.addEventListener("change", () => {

  if(

    roleSelect.value === "leader" ||

    roleSelect.value === "director"

  ){

    codeInput.style.display = "block";

  }

  else{

    codeInput.style.display = "none";

  }

});



function mostrarUsuario(userData){

  userDiv.innerHTML = `

    <div class="user-info">

      <img src="${userData.photo}">



      <div>

        <div class="user-name">

          ${userData.name}

        </div>



        <small>

          ${userData.email}

        </small>



        <br>



        <small>

          Cargo: ${userData.role}

        </small>

      </div>



      <button id="logoutBtn">
        Sair
      </button>

    </div>

  `;



  const logoutBtn = document.getElementById("logoutBtn");



  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

  });

}

loginBtn.addEventListener("click", async () => {

  const role = roleSelect.value;



  if(role === "leader"){

    if(codeInput.value !== LEADER_CODE){

      alert("Código de líder inválido");

      return;

    }

  }



  if(role === "director"){

    if(codeInput.value !== DIRECTOR_CODE){

      alert("Código de diretor inválido");

      return;

    }

  }



  try{

    const result = await signInWithPopup(auth, provider);



    const user = result.user;



    await setDoc(

      doc(db, "users", user.uid),

      {

        name: user.displayName,

        email: user.email,

        photo: user.photoURL,

        role: role

      }

    );

  }

  catch(error){

    console.error(error);

    alert("Erro no login");

  }

});



onAuthStateChanged(auth, async (user) => {

  if(user){

    loginBtn.style.display = "none";

    roleSelect.style.display = "none";

    codeInput.style.display = "none";



    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);



    if(userSnap.exists()){

      mostrarUsuario(userSnap.data());

    }

  }

  else{

    loginBtn.style.display = "block";

    roleSelect.style.display = "block";



    userDiv.innerHTML = "";

  }

});