import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  collection,

  addDoc,

  onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

  getAuth,

  onAuthStateChanged

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

const db = getFirestore(app);

const auth = getAuth(app);



let currentUser = null;

let selectedDate = null;



onAuthStateChanged(auth, (user) => {

  currentUser = user;

});



const calendarEl = document.getElementById("calendar");



const modal = document.getElementById("eventModal");

const closeModal = document.getElementById("closeModal");



const titleInput = document.getElementById("eventTitle");

const descInput = document.getElementById("eventDescription");

const imageInput = document.getElementById("eventImage");

const saveBtn = document.getElementById("saveEvent");



const calendar = new FullCalendar.Calendar(calendarEl, {

  initialView: "dayGridMonth",



  locale: "pt-br",



  selectable: true,



  dateClick(info){

    const role = localStorage.getItem("role");



    if(

      role === "leader" ||

      role === "director"

    ){

      selectedDate = info.dateStr;

      modal.style.display = "flex";

    }

  },



  eventClick(info){

    const event = info.event;



    alert(

      event.title +

      "\n\n" +

      event.extendedProps.description

    );

  }

});



calendar.render();



closeModal.addEventListener("click", () => {

  modal.style.display = "none";

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



saveBtn.addEventListener("click", async () => {

  let imageUrl = "";



  if(imageInput.files[0]){

    imageUrl = await uploadToCloudinary(

      imageInput.files[0]

    );

  }



  await addDoc(collection(db, "events"), {

    title: titleInput.value,

    description: descInput.value,

    date: selectedDate,

    image: imageUrl

  });



  modal.style.display = "none";



  titleInput.value = "";

  descInput.value = "";

  imageInput.value = "";

});



onSnapshot(collection(db, "events"), (snapshot) => {

  calendar.removeAllEvents();



  snapshot.forEach((doc) => {

    const data = doc.data();



    calendar.addEvent({

      title: data.title,

      start: data.date,

      description: data.description,

      image: data.image

    });

  });

});