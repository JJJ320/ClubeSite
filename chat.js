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

import {

  getStorage,

  ref,

  uploadBytes,

  getDownloadURL

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



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

const storage = getStorage(app);



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



sendBtn.addEventListener("click", async () => {

  if(!currentUser) return;



  let imageUrl = "";



  if(imageInput.files[0]){

    const file = imageInput.files[0];



    const storageRef = ref(

      storage,

      "chat-images/" + Date.now() + "-" + file.name

    );



    await uploadBytes(storageRef, file);



    imageUrl = await getDownloadURL(storageRef);

  }



  await addDoc(collection(db, "messages"), {

    name: currentUser.displayName,

    photo: currentUser.photoURL,

    text: input.value,

    image: imageUrl,

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



    messagesDiv.innerHTML += `

      <div class="message">

        <img class="profile-pic" src="${data.photo}">

        <div>

          <strong>${data.name}</strong>

          <p>${data.text || ""}</p>



          ${data.image ? `

            <img
              class="chat-image"
              src="${data.image}"
            >

          ` : ""}

        </div>

      </div>

    `;

  });



  messagesDiv.scrollTop = messagesDiv.scrollHeight;

});