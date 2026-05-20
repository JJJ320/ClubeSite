import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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

const db = getFirestore(app);



const dayInput = document.getElementById("dayInput");

const activityInput = document.getElementById("activityInput");

const noteInput = document.getElementById("noteInput");

const saveEventBtn = document.getElementById("saveEventBtn");

const eventsList = document.getElementById("eventsList");



saveEventBtn.addEventListener("click", async () => {

  if(

    !dayInput.value ||

    !activityInput.value

  ) return;



  await addDoc(collection(db, "agenda"), {

    day: dayInput.value,

    activity: activityInput.value,

    note: noteInput.value,

    createdAt: Date.now()

  });



  dayInput.value = "";

  activityInput.value = "";

  noteInput.value = "";

});



const q = query(

  collection(db, "agenda"),

  orderBy("createdAt", "desc")

);



onSnapshot(q, (snapshot) => {

  eventsList.innerHTML = "";



  snapshot.forEach((doc) => {

    const data = doc.data();



    eventsList.innerHTML += `

      <div class="event-card">

        <h2>${data.day}</h2>

        <h3>${data.activity}</h3>

        <p>${data.note || ""}</p>

      </div>

    `;

  });

});