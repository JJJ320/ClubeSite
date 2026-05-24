import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  collection,

  addDoc,

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



const role = localStorage.getItem("role");



const modal = document.getElementById("eventModal");

const closeModal = document.getElementById("closeModal");



const titleInput = document.getElementById("eventTitle");

const descInput = document.getElementById("eventDescription");

const imageInput = document.getElementById("eventImage");

const saveBtn = document.getElementById("saveEvent");



let selectedDate = "";



const calendarEl = document.getElementById("calendar");



const calendar = new FullCalendar.Calendar(calendarEl, {

  initialView: "dayGridMonth",



  locale: "pt-br",



  height: "auto",



  headerToolbar: {

    left: "prev,next today",

    center: "title",

    right: "dayGridMonth,timeGridWeek,timeGridDay"

  },



  dateClick(info){

    if(

      role === "leader" ||

      role === "director"

    ){

      selectedDate = info.dateStr;



      modal.style.display = "flex";



      document.body.style.overflow = "hidden";

    }

  },



  eventClick(info){

    const event = info.event;



    let text =

      "📌 " + event.title +

      "\n\n" +

      event.extendedProps.description;



    alert(text);



    if(event.extendedProps.image){

      window.open(

        event.extendedProps.image,

        "_blank"

      );

    }

  }

});



calendar.render();



closeModal.addEventListener("click", () => {

  modal.style.display = "none";



  document.body.style.overflow = "auto";

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

  if(!titleInput.value) return;



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



  document.body.style.overflow = "auto";



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