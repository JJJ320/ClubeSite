import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

  getFirestore,

  collection,

  addDoc,

  onSnapshot,

  updateDoc,

  doc,

  deleteDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

  getAuth,

  onAuthStateChanged

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

const db = getFirestore(app);

const auth = getAuth(app);



const role = localStorage.getItem("role");



const pollsDiv =

  document.getElementById("polls");



const adminPanel =

  document.getElementById("adminPanel");



let currentUser = null;



onAuthStateChanged(auth, (user) => {

  currentUser = user;

});



if(

  role === "leader" ||

  role === "director"

){

  adminPanel.innerHTML = `

    <div class="create-poll">

      <input

        type="text"

        id="pollQuestion"

        placeholder="Pergunta da votação"

      >



      <input

        type="text"

        id="option1"

        placeholder="Opção 1"

      >



      <input

        type="text"

        id="option2"

        placeholder="Opção 2"

      >



      <input

        type="text"

        id="option3"

        placeholder="Opção 3"

      >



      <button id="createPollBtn">

        Criar votação

      </button>

    </div>

  `;



  document

    .getElementById("createPollBtn")

    .addEventListener("click", criarVotacao);

}



async function criarVotacao(){

  const question =

    document.getElementById("pollQuestion").value;



  const option1 =

    document.getElementById("option1").value;



  const option2 =

    document.getElementById("option2").value;



  const option3 =

    document.getElementById("option3").value;



  if(!question) return;



  await addDoc(collection(db, "polls"), {

    question,



    options:[

      {

        text:option1,

        votes:0

      },



      {

        text:option2,

        votes:0

      },



      {

        text:option3,

        votes:0

      }

    ],



    voters:[]

  });

}



onSnapshot(collection(db, "polls"), (snapshot) => {

  pollsDiv.innerHTML = "";



  snapshot.forEach((documento) => {

    const data = documento.data();



    const poll = document.createElement("div");



    poll.className = "poll-card";



    poll.innerHTML = `

      <h2>

        ${data.question}

      </h2>



      <div class="options"></div>

    `;



    const optionsDiv =

      poll.querySelector(".options");



    data.options.forEach((option, index) => {

      const button = document.createElement("button");



      button.innerHTML = `

        ${option.text}

        (${option.votes} votos)

      `;



      button.onclick = () => votar(

        documento.id,

        data,

        index

      );



      optionsDiv.appendChild(button);

    });



    if(

      role === "leader" ||

      role === "director"

    ){

      const deleteBtn =

        document.createElement("button");



      deleteBtn.textContent = "Apagar";



      deleteBtn.className = "delete-poll";



      deleteBtn.onclick = async () => {

        await deleteDoc(

          doc(db, "polls", documento.id)

        );

      };



      poll.appendChild(deleteBtn);

    }



    pollsDiv.appendChild(poll);

  });

});



async function votar(id, data, index){

  if(!currentUser) return;



  if(

    data.voters.includes(

      currentUser.uid

    )

  ){

    alert("Você já votou.");

    return;

  }



  data.options[index].votes++;



  data.voters.push(

    currentUser.uid

  );



  await updateDoc(

    doc(db, "polls", id),

    {

      options:data.options,

      voters:data.voters

    }

  );

}