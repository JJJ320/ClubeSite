import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

  getAuth,

  GoogleAuthProvider,

  signInWithPopup,

  onAuthStateChanged,

  signOut,

  setPersistence,

  browserLocalPersistence,

  updateProfile

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



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



const loginBtn =

  document.getElementById("loginBtn");



const userDiv =

  document.getElementById("user");



const roleSelect =

  document.getElementById("roleSelect");



const codeInput =

  document.getElementById("codeInput");



const profileModal =

  document.getElementById("profileModal");



const closeProfileModal =

  document.getElementById("closeProfileModal");



const newName =

  document.getElementById("newName");



const newPhoto =

  document.getElementById("newPhoto");



const saveProfileBtn =

  document.getElementById("saveProfileBtn");



const LEADER_CODE = "lider123";

const DIRECTOR_CODE = "diretor123";



await setPersistence(

  auth,

  browserLocalPersistence

);



loginBtn.addEventListener("click", async () => {

  const role = roleSelect.value;



  if(

    role === "leader" &&

    codeInput.value !== LEADER_CODE

  ){

    alert("Código de líder inválido");

    return;

  }



  if(

    role === "director" &&

    codeInput.value !== DIRECTOR_CODE

  ){

    alert("Código de diretor inválido");

    return;

  }



  try{

    const result =

      await signInWithPopup(auth, provider);



    localStorage.setItem(

      "role",

      role

    );



  }

  catch(error){

    console.error(error);

    alert("Erro no login");

  }

});



onAuthStateChanged(auth, (user) => {

  if(user){

    loginBtn.style.display = "none";



    roleSelect.style.display = "none";



    codeInput.style.display = "none";



    userDiv.innerHTML = `

      <div class="user-info">

        <img src="${user.photoURL}">



        <div>

          <div class="user-name">

            ${user.displayName}

          </div>



          <div>

            ${user.email}

          </div>

        </div>



        <button id="editProfileBtn">

          Editar Perfil

        </button>



        <button id="logoutBtn">

          Sair

        </button>

      </div>

    `;



    document

      .getElementById("logoutBtn")

      .addEventListener("click", async () => {

        await signOut(auth);

      });



    document

      .getElementById("editProfileBtn")

      .addEventListener("click", () => {

        profileModal.style.display = "flex";

      });

  }

  else{

    loginBtn.style.display = "block";



    roleSelect.style.display = "block";



    codeInput.style.display = "block";



    userDiv.innerHTML = "";

  }

});



closeProfileModal.addEventListener("click", () => {

  profileModal.style.display = "none";

});



async function uploadToCloudinary(file){

  const formData = new FormData();



  formData.append("file", file);

  formData.append("upload_preset", "chat_upload");



  const response = await fetch(

    "https://api.cloudinary.com/v1_1/dlmrbca0i/auto/upload",

    {

      method:"POST",

      body:formData

    }

  );



  const data = await response.json();



  return data.secure_url;

}



saveProfileBtn.addEventListener("click", async () => {

  const user = auth.currentUser;



  if(!user) return;



  let photoURL = user.photoURL;



  if(newPhoto.files[0]){

    photoURL = await uploadToCloudinary(

      newPhoto.files[0]

    );

  }



  await updateProfile(user, {

    displayName:

      newName.value || user.displayName,



    photoURL: photoURL

  });



  location.reload();

});