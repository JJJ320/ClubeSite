import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  collection,

  addDoc,

  onSnapshot,

  deleteDoc,

  updateDoc,

  doc

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

const viewModal = document.getElementById("viewModal");



const closeModal = document.getElementById("closeModal");

const closeViewModal = document.getElementById("closeViewModal");



const titleInput = document.getElementById("eventTitle");

const descInput = document.getElementById("eventDescription");

const imageInput = document.getElementById("eventImage");

const saveBtn = document.getElementById("saveEvent");



const viewTitle = document.getElementById("viewTitle");

const viewDescription = document.getElementById("viewDescription");

const viewImage = document.getElementById("viewImage");



const adminButtons = document.getElementById("adminButtons");

const editEventBtn = document.getElementById("editEventBtn");

const deleteEventBtn = document.getElementById("deleteEventBtn");



let selectedDate = "";

let selectedEventId = "";



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

    }

  },



  eventClick(info){

    const event = info.event;



    selectedEventId = event.id;



    viewTitle.textContent = event.title;



    viewDescription.textContent =

      event.extendedProps.description;



    if(event.extendedProps.image){

      viewImage.src = event.extendedProps.image;

      viewImage.style.display = "block";

    }

    else{

      viewImage.style.display = "none";

    }



    if(

      role === "leader" ||

      role === "director"

    ){

      adminButtons.style.display = "flex";

    }

    else{

      adminButtons.style.display = "none";

    }



    viewModal.style.display = "flex";

  }

});



calendar.render();



closeModal.addEventListener("click", () => {

  modal.style.display = "none";

});



closeViewModal.addEventListener("click", () => {

  viewModal.style.display = "none";

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



  titleInput.value = "";

  descInput.value = "";

  imageInput.value = "";

});



deleteEventBtn.addEventListener("click", async () => {

  await deleteDoc(

    doc(db, "events", selectedEventId)

  );



  viewModal.style.display = "none";

});



editEventBtn.addEventListener("click", async () => {

  const newTitle = prompt("Novo título:");



  if(!newTitle) return;



  await updateDoc(

    doc(db, "events", selectedEventId),

    {

      title: newTitle

    }

  );

});



onSnapshot(collection(db, "events"), (snapshot) => {

  calendar.removeAllEvents();



  snapshot.forEach((documento) => {

    const data = documento.data();



    calendar.addEvent({

      id: documento.id,

      title: data.title,

      start: data.date,

      description: data.description,

      image: data.image

    });

  });

});