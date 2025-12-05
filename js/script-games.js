// ----------------------
// Données du jeu
// ----------------------
const QUESTIONS = [
{
  proprietary: "Photoshop",
  libre: "GIMP",
  info: "GIMP permet de retoucher des images comme Photoshop : calques, filtres, détourages… mais sans abonnement. Il consomme moins de ressources et fonctionne sur Windows, Linux et macOS.",
  download: "https://www.gimp.org/downloads/"
},
{
  proprietary: "Word",
  libre: "LibreOffice Writer",
  info: "LibreOffice Writer ouvre et crée des documents .docx sans problème. Il offre le formatage avancé, les styles, l’export PDF, et n’impose aucune licence : tout est gratuit et open source.",
  download: "https://www.libreoffice.org/download/download-libreoffice/"
},
{
  proprietary: "Windows",
  libre: "Linux",
  info: "Linux est un système d’exploitation libre, plus sécurisé car il limite les virus et laisse un contrôle total sur la machine. Plusieurs versions existent, du simple pour débutants (Ubuntu) au très personnalisable.",
  download: "https://ubuntu.com/download"
},
{
  proprietary: "Excel",
  libre: "LibreOffice Calc",
  info: "LibreOffice Calc est un tableur compatible Excel : formules, graphiques, tableaux croisés… Il lit les fichiers .xlsx et permet même des macros sans dépendances propriétaires.",
  download: "https://www.libreoffice.org/download/download-libreoffice/"
},
{
  proprietary: "Pronote",
  libre: "SchoolTool / Gibbon",
  info: "SchoolTool et Gibbon gèrent les élèves, les notes et la vie scolaire. Ils sont libres, installables sur un serveur local, et évitent la dépendance à des plateformes privées.",
  download: "https://gibbonedu.org/ (Gibbon) / https://schooltool.org/"
},
{
  proprietary: "OneDrive",
  libre: "Nextcloud",
  info: "Nextcloud permet de stocker et partager des fichiers comme OneDrive, mais sur ton propre serveur. Sécurisé, chiffré, collaboratif, et 100% maîtrisé par l’utilisateur ou l’organisation.",
  download: "https://nextcloud.com/install/"
}
];

let currentQuestion = 0;
let answered = false;
let score = 0;
let timerInterval;

// ----------------------
// ÉCRAN 1 : Intro
// ----------------------
function renderIntro() {
  document.getElementById("app").innerHTML = `
    <div class="space-y-8 bg-white/90 p-8 rounded-2xl shadow-xl">

      <div class="flex gap-6 items-start">
        <img src="../media/Monkey.png" class="w-32 h-32 object-cover rounded-full shadow-lg">
        <div class="relative flex-1">
          <div id="speech" class="bg-yellow-100 border-2 border-yellow-300 p-6 rounded-2xl shadow-md">
            <p class="text-xl">
              Bonjour, je suis le Singe Savant ! 
            </p>
            <p class="text-xl">Bienvenue dans mon cours de traduction de logiciels propriétaires en logiciels libres. </p>
            <p class="text-xl">Ensemble, on va explorer des alternatives pour écrire des documents, modifier des photos et même envoyer des courriels !
            </p>
          </div>
        </div>
      </div>

      <button onclick="startGame()"
        class="block mx-auto bg-blue-500 text-white px-6 py-3 rounded-xl text-xl hover:bg-blue-600">
        Commencer le jeu
      </button>
    </div>
  `;
}

// ----------------------
function startGame() {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
}


// ----------------------
// ÉCRAN QUESTION
function renderQuestion() {
  answered = false;
  const q = QUESTIONS[currentQuestion];

  // Générer fausses réponses
  const wrong = QUESTIONS.filter(x => x.libre !== q.libre)
    .map(x => x.libre)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [q.libre, ...wrong].sort(() => Math.random() - 0.5);

  document.getElementById("app").innerHTML = `
    <div class="space-y-6 bg-white/90 p-8 rounded-2xl shadow-xl">

      <!-- Conteneur flex pour timer + score -->
      <div class="flex justify-between items-center mb-4">
        <!-- Timer -->
        <div class="timer-container">
            <div id="timerFill" class="timer-fill"></div>
        </div>

        <!-- Score -->
        <div id="score" class="font-bold text-lg text-gray-700">Score : ${score}</div>
      </div>

      <!-- Texte et singe -->
      <div class="flex gap-6 items-start">
        <img id="monkeyFace" src="../media/Monkey.png"
             class="w-32 h-32 object-cover rounded-full shadow-lg">

        <div class="relative flex-1">
          <div id="speech" class="bg-blue-100 border-2 border-blue-300 p-6 rounded-2xl shadow-md">
            <p class="text-xl speech">Quelle alternative libre pour <b>${q.proprietary}</b> ?</p>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div id="buttons" class="grid grid-cols-2 gap-4">
        ${options.map(opt => `
          <button class="choice-btn py-4 px-4 text-lg bg-blue-100 hover:bg-blue-200 rounded-xl transition transform"
                  onclick="choose('${escapeQuotes(opt)}')">
            ${opt}
          </button>
        `).join("")}
      </div>

      <div class="text-center">
        <button id="nextBtn"
          onclick="nextQuestion()"
          class="hidden text-4xl text-green-600 hover:scale-110 transition">
          ➜
        </button>
      </div>
    </div>
  `;

  // Démarrer timer
  startTimer(10); // 10 secondes
}

// ----------------------
function escapeQuotes(str) {
  return String(str).replace(/'/g, "\\'");
}

// ----------------------
// TIMER
function startTimer(seconds) {
  const fill = document.getElementById("timerFill");
  let remaining = seconds;
  clearInterval(timerInterval);
  fill.style.width = "100%";

  timerInterval = setInterval(() => {
    remaining -= 0.1;

    // Changer la largeur
    fill.style.width = `${(remaining / seconds) * 100}%`;

    // Ajouter une classe si moins de 3 secondes
    if (remaining <= 3) {
      fill.classList.add("timer-left"); // ta classe CSS pour alerter
    } else {
      fill.classList.remove("timer-left");
    }

    // Quand le temps est écoulé
    if (remaining <= 0) {
      clearInterval(timerInterval);
      fill.style.width = "0%";
       // Supprimer le timer du DOM
      const timerContainer = document.querySelector(".timer-container");
      if (timerContainer) timerContainer.remove();
      if (!answered) choose(""); // time out
    }
  }, 100);
}


// ----------------------
// CHOIX UTILISATEUR
function choose(choice) {
  if(answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q = QUESTIONS[currentQuestion];
  const correctAnswer = q.libre.trim();
  const selected = choice.trim();
  const buttons = document.querySelectorAll("#buttons .choice-btn");

  buttons.forEach(btn => {
    const text = btn.textContent.trim();
    const base = "py-4 px-4 text-lg rounded-xl transition transform";

    if(text === correctAnswer){
      btn.className = `${base} bg-green-500 text-white scale-105`;
    } else if(text === selected){
      btn.className = `${base} bg-red-500 text-white scale-95`;
    } else {
      btn.className = `${base} bg-gray-300 text-gray-600`;
    }
    btn.disabled = true;
  });

  // Changer image singe
  const monkey = document.getElementById("monkeyFace");
  if(selected === correctAnswer){
    monkey.src = "../media/Monkey-head-happy.png";
    score++;
  } else {
    monkey.src = "../media/Monkey-head-sad.png";
  }

  // Texte machine à écrire
  const speech = document.getElementById("speech");
  typeWriter(speech, `${q.info}. 🔗 Pour le télecharger : <a href="${q.download}" target="_blank">${q.download}</a>`, 0);

  // Afficher bouton suivant
  document.getElementById("nextBtn").classList.remove("hidden");
}

// ----------------------
// MACHINE À ÉCRIRE
function typeWriter(container, text, i){
  container.innerHTML = '';
  let idx = 0;
  const interval = setInterval(()=>{
    container.innerHTML = text.slice(0, idx+1);
    idx++;
    if(idx >= text.length) clearInterval(interval);
  }, 40); // 40ms par caractère
}

// ----------------------
function nextQuestion(){
  currentQuestion++;
  if(currentQuestion >= QUESTIONS.length){
    renderEnd();
  } else {
    renderQuestion();
  }
}

// ----------------------
function renderEnd(){
  document.getElementById("app").innerHTML = `
    <div class="bg-white/90 p-8 rounded-2xl shadow-xl text-center space-y-6">
      <img src="../media/Monkey-head-happy.png" class="w-32 h-32 mx-auto rounded-full shadow-lg">

      <h1 class="text-3xl font-bold">Bravo, c'est terminé ! 🎉</h1>
      <p class="text-xl">Score final : ${score}/${QUESTIONS.length}</p>

      <button onclick="startGame()"
        class="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl hover:bg-blue-600">
        Rejouer
      </button>
      <button onclick="window.location.href='../index.html'"
        class="bg-green-500 text-white px-6 py-3 rounded-xl text-xl hover:bg-green-600">
        Retour au village
      </button>
    </div>
  `;

}

renderIntro();
