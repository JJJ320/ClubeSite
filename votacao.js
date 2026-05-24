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



      <div id="optionsContainer"></div>



      <button id="addOptionBtn">

        + Adicionar opção

      </button>



      <button id="createPollBtn">

        Criar votação

      </button>

    </div>

  `;



  adicionarOpcao();

  adicionarOpcao();



  document

    .getElementById("addOptionBtn")

    .addEventListener("click", adicionarOpcao);



  document

    .getElementById("createPollBtn")

    .addEventListener("click", criarVotacao);

}



function adicionarOpcao(){

  const div = document.createElement("div");



  div.className = "poll-option-editor";



  div.innerHTML = `

    <input

      type="text"

      class="optionTitle"

      placeholder="Nome da atividade"

    >



    <textarea

      class="optionDescription"

      placeholder="Descrição da atividade"

    ></textarea>



    <input

      type="file"

      class="optionImage"

      accept="image/*"

    >

  `;



  document

    .getElementById("optionsContainer")

    .appendChild(div);

}



async function criarVotacao(){

  const question =

    document.getElementById("pollQuestion").value;



  if(!question) return;



  const optionElements =

    document.querySelectorAll(

      ".poll-option-editor"

    );



  const options = [];



  for(const element of optionElements){

    const title =

      element.querySelector(

        ".optionTitle"

      ).value;



    const description =

      element.querySelector(

        ".optionDescription"

      ).value;



    const imageFile =

      element.querySelector(

        ".optionImage"

      ).files[0];



    let image = "";



    if(imageFile){

      image = await uploadToCloudinary(

        imageFile

      );

    }



    options.push({

      title,

      description,

      image,

      votes:0

    });

  }



  await addDoc(collection(db, "polls"), {

    question,

    options,

    voters:[]

  });

}



onSnapshot(collection(db, "polls"), (snapshot) => {

  pollsDiv.innerHTML = "";



  snapshot.forEach((documento) => {

    const data = documento.data();



    const totalVotes =

      data.options.reduce(

        (acc, option) =>

          acc + option.votes,

        0

      );



    const poll = document.createElement("div");



    poll.className = "poll-card";



    poll.innerHTML = `

      <h2>

        ${data.question}

      </h2>

    `;



    data.options.forEach((option, index) => {

      const percentage =

        totalVotes > 0

        ?

        Math.round(

          (option.votes / totalVotes)

          * 100

        )

        :

        0;



      const optionDiv =

        document.createElement("div");



      optionDiv.className =

        "vote-option-card";



      optionDiv.innerHTML = `

        <img src="${option.image}">



        <h3>

          ${option.title}

        </h3>



        <p>

          ${option.description}

        </p>



        <div class="vote-bar">

          <div

            class="vote-fill"

            style="width:${percentage}%"

          ></div>

        </div>



        <div class="vote-info">

          ${option.votes} votos

          (${percentage}%)

        </div>



        <button>

          Votar

        </button>

      `;



      optionDiv

        .querySelector("button")

        .onclick = () => votar(

          documento.id,

          data,

          index

        );



      poll.appendChild(optionDiv);

    });



    if(

      role === "leader" ||

      role === "director"

    ){

      const deleteBtn =

        document.createElement("button");



      deleteBtn.textContent = "Apagar votação";



      deleteBtn.className =

        "delete-poll";



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