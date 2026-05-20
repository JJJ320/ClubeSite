import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth,

  GoogleAuthProvider,

  signInWithPopup,

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

  getFirestore,

  collection,

  addDoc,

  query,

  orderBy,

  onSnapshot

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



const messagesDiv = document.getElementById("messages");

const input = document.getElementById("messageInput");

const sendBtn = document.getElementById("sendBtn");

const imageInput = document.getElementById("imageInput");



let currentUser = null;



onAuthStateChanged(auth, (user) => {

  if(user){

    currentUser = user;

  }

  else{

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider);

  }

});



async function uploadToCloudinary(file){

  const formData = new FormData();



  formData.append("file", file);

  formData.append("upload_preset", "chat_upload");



  const response = await fetch(

    "https://api.cloudinary.com/v1_1/dlmrbca0i/auto/upload",

    {

      method: "POST",

      body: formData

    }

  );



  const data = await response.json();



  return data.secure_url;

}



sendBtn.addEventListener("click", async () => {

  if(!currentUser) return;



  let fileUrl = "";

  let fileType = "";



  if(imageInput.files[0]){

    const file = imageInput.files[0];



    fileUrl = await uploadToCloudinary(file);



    fileType = file.type;

  }



  await addDoc(collection(db, "messages"), {

    name: currentUser.displayName,

    photo: currentUser.photoURL,

    text: input.value,

    file: fileUrl,

    type: fileType,

    createdAt: Date.now()

  });



  input.value = "";

  imageInput.value = "";

});



const q = query(

  collection(db, "messages"),

  orderBy("createdAt")

);



onSnapshot(q, (snapshot) => {

  messagesDiv.innerHTML = "";



  snapshot.forEach((doc) => {

    const data = doc.data();



    let mediaHTML = "";



    if(data.file){

      if(data.type.startsWith("image")){

        mediaHTML = `

          <img
            class="chat-image"
            src="${data.file}"
          >

        `;

      }



      else if(data.type.startsWith("audio")){

        mediaHTML = `

          <audio controls>

            <source src="${data.file}">

          </audio>

        `;

      }



      else if(data.type.startsWith("video")){

        mediaHTML = `

          <video
            controls
            class="chat-video"
          >

            <source src="${data.file}">

          </video>

        `;

      }

    }



    messagesDiv.innerHTML += `

      <div class="message">

        <img
          class="profile-pic"
          src="${data.photo}"
        >



        <div class="message-content">

          <strong>${data.name}</strong>

          <p>${data.text || ""}</p>



          ${mediaHTML}

        </div>

      </div>

    `;

  });



  messagesDiv.scrollTop = messagesDiv.scrollHeight;

});