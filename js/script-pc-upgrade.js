// ----------------------
// État du jeu
// ----------------------
const gameState = {
  currentStep: 0,
  ramInstalled: 0,
  totalRamSlots: 4,
  ramCapacity: 0, // en GB
  osInstalled: null
};

// ----------------------
// ÉTAPE 1 : Introduction
// ----------------------
function renderIntro() {
  document.getElementById("app").innerHTML = `
    <div class="space-y-8 bg-white/90 p-8 rounded-2xl shadow-xl fade-in">

      <div class="flex gap-6 items-start">
        <img src="../media/Monkey.png" class="w-32 h-32 object-cover rounded-full shadow-lg">
        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">🖥️ Mission : Upgrade PC</h1>
          <p class="text-lg text-gray-700 leading-relaxed">
            Bienvenue jeune technicien ! Aujourd'hui, tu vas apprendre à améliorer un ordinateur.
          </p>
          <p class="text-lg text-gray-700 leading-relaxed mt-3">
            Ta mission : <strong>installer de la RAM</strong> et remplacer <strong>Windows par Linux</strong>.
          </p>
        </div>
      </div>

      <div class="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-3">📚 Ce que tu vas apprendre :</h3>
        <ul class="space-y-2 text-gray-700">
          <li>✅ Comment installer de la RAM dans un ordinateur</li>
          <li>✅ Pourquoi la RAM est importante pour les performances</li>
          <li>✅ Comment installer Linux à la place de Windows</li>
          <li>✅ Les avantages d'un système d'exploitation libre</li>
        </ul>
      </div>

      <button onclick="startGame()" class="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg">
        Commencer la mission 🚀
      </button>

    </div>
  `;
}

// ----------------------
// ÉTAPE 2 : Installation de la RAM
// ----------------------
function renderRamInstallation() {
  gameState.currentStep = 1;
  
  document.getElementById("app").innerHTML = `
    <div class="space-y-8 bg-white/90 p-8 rounded-2xl shadow-xl fade-in">

      <h2 class="text-3xl font-bold text-gray-800 text-center">🔧 Étape 1 : Installation de la RAM</h2>

      <div class="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
        <p class="text-gray-700 text-center">
          <strong>Instructions :</strong> Glisse les barrettes de RAM dans les slots vides de l'ordinateur.
          <br>Tu as besoin d'au moins <strong>8 GB de RAM</strong> pour installer Linux correctement !
        </p>
      </div>

      <div class="flex justify-center gap-6 items-start flex-wrap">
        
        <!-- Ordinateur avec slots RAM -->
        <div class="computer-case">
          <div style="padding: 20px;">
            <h3 class="text-white text-center font-bold mb-3 text-lg">Slots RAM</h3>
            <div class="ram-slots" id="ramSlots">
              <!-- Les slots seront générés ici -->
            </div>
            
            <div class="mt-4 text-white text-center">
              <div class="text-xl font-bold mb-1">
                RAM: <span id="ramCounter" class="text-green-400">0 GB</span>
              </div>
              <div class="text-xs opacity-75">
                Slots: <span id="slotsUsed">0</span>/${gameState.totalRamSlots}
              </div>
            </div>
          </div>
        </div>

        <!-- Inventaire de RAM -->
        <div class="flex-1 min-w-[250px] max-w-[350px]">
          <h3 class="text-lg font-bold text-gray-800 text-center mb-3">📦 Barrettes disponibles</h3>
          <div class="ram-inventory" id="ramInventory">
            <!-- Les barrettes seront générées ici -->
          </div>
          <p class="text-xs text-gray-600 text-center mt-2">
            Glisse-dépose les barrettes<br>Clique sur ❌ pour retirer
          </p>
        </div>

      </div>

      <div id="ramMessage" class="min-h-[60px]"></div>

      <button id="continueBtn" onclick="checkRamAndContinue()" disabled 
              class="w-full py-4 bg-gray-400 text-white text-xl font-bold rounded-xl cursor-not-allowed transition shadow-lg">
        Continuer (8 GB minimum requis)
      </button>

    </div>
  `;

  generateRamSlots();
  generateRamInventory();
}

function generateRamSlots() {
  const slotsContainer = document.getElementById("ramSlots");
  slotsContainer.innerHTML = "";

  for (let i = 0; i < gameState.totalRamSlots; i++) {
    const slot = document.createElement("div");
    slot.className = "ram-slot empty";
    slot.id = `slot-${i}`;
    slot.dataset.slotIndex = i;
    
    // Événements de drag and drop
    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("drop", handleDrop);
    slot.addEventListener("click", handleSlotClick);
    
    slotsContainer.appendChild(slot);
  }
}

function generateRamInventory() {
  const inventory = document.getElementById("ramInventory");
  inventory.innerHTML = "";

  // Différentes capacités de RAM disponibles
  const ramTypes = [
    { capacity: 4, color: "#00cc55" },
    { capacity: 4, color: "#00cc55" },
    { capacity: 8, color: "#0099ff" },
    { capacity: 8, color: "#0099ff" }
  ];

  ramTypes.forEach((ram, index) => {
    const ramDiv = document.createElement("div");
    ramDiv.className = "draggable-ram";
    ramDiv.draggable = true;
    ramDiv.id = `ram-${index}`;
    ramDiv.dataset.capacity = ram.capacity;
    
    ramDiv.innerHTML = `
      <div class="ram-stick" style="background: linear-gradient(to right, ${ram.color}, ${adjustColor(ram.color, -20)});">
        <div style="color: white; font-weight: bold; text-align: center;">${ram.capacity}GB</div>
        <div class="ram-chip"></div>
        <div class="ram-chip"></div>
        <div class="ram-chip"></div>
        <div class="ram-chip"></div>
        <div class="ram-chip"></div>
      </div>
    `;
    
    ramDiv.addEventListener("dragstart", handleDragStart);
    inventory.appendChild(ramDiv);
  });
}

// Ajuster la couleur pour le gradient
function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
  );
}

// Gestion du drag and drop
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = e.target.closest('.draggable-ram');
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  e.preventDefault();
  
  const slot = e.target.closest('.ram-slot');
  if (!slot || !draggedElement) return;
  
  // Vérifier si le slot est vide
  if (slot.classList.contains('filled')) {
    showRamMessage("Ce slot est déjà occupé !", "error");
    return;
  }
  
  // Installer la RAM
  const capacity = parseInt(draggedElement.dataset.capacity);
  const ramStickClone = draggedElement.querySelector('.ram-stick').cloneNode(true);
  
  slot.innerHTML = "";
  slot.appendChild(ramStickClone);
  slot.classList.remove('empty');
  slot.classList.add('filled');
  slot.dataset.capacity = capacity;
  
  // Retirer de l'inventaire
  draggedElement.remove();
  
  // Mettre à jour les compteurs
  gameState.ramInstalled++;
  gameState.ramCapacity += capacity;
  
  updateRamDisplay();
  checkRamRequirement();
  
  showRamMessage(`Barrette de ${capacity}GB installée avec succès ! 🎉`, "success");
  
  return false;
}

function updateRamDisplay() {
  document.getElementById("ramCounter").textContent = `${gameState.ramCapacity} GB`;
  document.getElementById("slotsUsed").textContent = gameState.ramInstalled;
}

function checkRamRequirement() {
  const continueBtn = document.getElementById("continueBtn");
  
  if (gameState.ramCapacity >= 8) {
    continueBtn.disabled = false;
    continueBtn.className = "w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg cursor-pointer";
    showRamMessage(`✅ Parfait ! Tu as ${gameState.ramCapacity}GB de RAM installée. C'est suffisant pour Linux !`, "success");
  } else {
    continueBtn.disabled = true;
    continueBtn.className = "w-full py-4 bg-gray-400 text-white text-xl font-bold rounded-xl cursor-not-allowed transition shadow-lg";
    showRamMessage(`⚠️ Il te faut encore ${8 - gameState.ramCapacity}GB de RAM pour continuer.`, "info");
  }
}

function showRamMessage(text, type) {
  const messageDiv = document.getElementById("ramMessage");
  messageDiv.innerHTML = `<div class="message ${type} fade-in">${text}</div>`;
}

// Fonction pour retirer une RAM d'un slot
function handleSlotClick(e) {
  const slot = e.target.closest('.ram-slot');
  if (!slot || !slot.classList.contains('filled')) return;
  
  // Récupérer la capacité de la RAM à retirer
  const capacity = parseInt(slot.dataset.capacity);
  const ramStick = slot.querySelector('.ram-stick');
  
  if (!ramStick) return;
  
  // Remettre la barrette dans l'inventaire
  const inventory = document.getElementById("ramInventory");
  const ramDiv = document.createElement("div");
  ramDiv.className = "draggable-ram fade-in";
  ramDiv.draggable = true;
  ramDiv.dataset.capacity = capacity;
  
  const ramStickClone = ramStick.cloneNode(true);
  ramDiv.appendChild(ramStickClone);
  ramDiv.addEventListener("dragstart", handleDragStart);
  
  inventory.appendChild(ramDiv);
  
  // Vider le slot
  slot.innerHTML = "";
  slot.classList.remove('filled');
  slot.classList.add('empty');
  delete slot.dataset.capacity;
  
  // Mettre à jour les compteurs
  gameState.ramInstalled--;
  gameState.ramCapacity -= capacity;
  
  updateRamDisplay();
  checkRamRequirement();
  
  showRamMessage(`Barrette de ${capacity}GB retirée. Elle est de retour dans l'inventaire.`, "info");
}

function checkRamAndContinue() {
  if (gameState.ramCapacity >= 8) {
    renderOsSelection();
  }
}

// ----------------------
// ÉTAPE 3 : Sélection de l'OS
// ----------------------
function renderOsSelection() {
  gameState.currentStep = 2;
  
  document.getElementById("app").innerHTML = `
    <div class="space-y-6 bg-white/90 p-8 rounded-2xl shadow-xl fade-in">

      <h2 class="text-3xl font-bold text-gray-800 text-center">💿 Étape 2 : Installation du système d'exploitation</h2>

      <div class="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
        <p class="text-gray-700 text-center">
          <strong>Attention :</strong> Cet ordinateur a actuellement Windows installé.
          <br>Quel système d'exploitation veux-tu installer ?
        </p>
      </div>

      <!-- Écran d'ordinateur -->
      <div class="flex justify-center">
        <div>
          <div class="monitor">
            <div class="monitor-screen" id="monitorScreen">
              <div class="terminal-text">
                <div class="blink">_</div>
                <div>Système prêt pour l'installation...</div>
              </div>
            </div>
          </div>
          <div class="monitor-stand"></div>
        </div>
      </div>

      <div class="flex gap-6 justify-center flex-wrap">
        <button onclick="selectOS('windows')" class="os-button windows">
          <div class="text-2xl mb-2">🪟</div>
          Garder Windows
          <div class="text-sm opacity-75 mt-1">Système propriétaire</div>
        </button>

        <button onclick="selectOS('linux')" class="os-button linux">
          <div class="text-2xl mb-2">🐧</div>
          Installer Linux
          <div class="text-sm opacity-75 mt-1">Système libre</div>
        </button>
      </div>

      <div id="osMessage" class="min-h-[60px]"></div>

    </div>
  `;
}

function selectOS(os) {
  gameState.osInstalled = os;
  
  const messageDiv = document.getElementById("osMessage");
  
  if (os === "windows") {
    messageDiv.innerHTML = `
      <div class="message error fade-in">
        <div class="text-lg mb-2">❌ Mauvais choix !</div>
        <p>Windows est un système propriétaire qui limite ta liberté et ta vie privée.</p>
        <p class="mt-2">Essaie plutôt Linux pour découvrir un système libre et puissant ! 🐧</p>
      </div>
    `;
    
    // Réactiver les boutons après 2 secondes
    setTimeout(() => {
      const buttons = document.querySelectorAll('.os-button');
      buttons.forEach(btn => btn.disabled = false);
    }, 2000);
    
  } else {
    // Installation de Linux
    installLinux();
  }
}

function installLinux() {
  const monitorScreen = document.getElementById("monitorScreen");
  const messageDiv = document.getElementById("osMessage");
  
  // Animation d'installation
  monitorScreen.innerHTML = `
    <div class="terminal-text w-full">
      <div>[ OK ] Installation de Linux Ubuntu 24.04 LTS</div>
      <div>[ OK ] Configuration du système de fichiers ext4</div>
      <div>[ OK ] Installation des paquets de base</div>
      <div>[ OK ] Configuration de GRUB bootloader</div>
      <div class="mt-4">
        <div class="progress-bar">
          <div class="progress-fill" id="installProgress">0%</div>
        </div>
      </div>
    </div>
  `;
  
  messageDiv.innerHTML = `
    <div class="message info fade-in">
      ⏳ Installation de Linux en cours...
    </div>
  `;
  
  // Désactiver les boutons
  const buttons = document.querySelectorAll('.os-button');
  buttons.forEach(btn => btn.disabled = true);
  
  // Simulation de la progression
  let progress = 0;
  const progressBar = document.getElementById("installProgress");
  
  const interval = setInterval(() => {
    progress += 2;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        showLinuxSuccess();
      }, 500);
    }
  }, 50);
}

function showLinuxSuccess() {
  const monitorScreen = document.getElementById("monitorScreen");
  const messageDiv = document.getElementById("osMessage");
  
  monitorScreen.innerHTML = `
    <div class="terminal-text">
      <div class="text-2xl mb-4">🐧 Ubuntu 24.04 LTS</div>
      <div>✅ Installation terminée avec succès !</div>
      <div class="mt-4">RAM: ${gameState.ramCapacity}GB</div>
      <div>Système: Linux (libre et open-source)</div>
    </div>
  `;
  
  messageDiv.innerHTML = `
    <div class="message success fade-in">
      <div class="text-lg mb-2">🎉 Excellent choix !</div>
      <p>Linux est installé ! Tu as choisi un système libre, sécurisé et respectueux de ta vie privée.</p>
    </div>
  `;
  
  // Afficher le bouton de fin
  setTimeout(() => {
    renderCompletion();
  }, 2000);
}

// ----------------------
// ÉTAPE 4 : Écran de fin
// ----------------------
function renderCompletion() {
  document.getElementById("app").innerHTML = `
    <div class="space-y-8 bg-white/90 p-8 rounded-2xl shadow-xl fade-in">

      <div class="text-center">
        <div class="text-6xl mb-4">🏆</div>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Mission accomplie !</h1>
        <p class="text-xl text-gray-700">
          Bravo ! Tu as réussi à upgrader l'ordinateur avec succès.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-green-50 p-6 rounded-xl border-2 border-green-200">
          <div class="text-3xl mb-3 text-center">💾</div>
          <h3 class="text-xl font-bold text-green-800 mb-3 text-center">RAM installée</h3>
          <p class="text-gray-700 text-center">
            Tu as installé <strong>${gameState.ramCapacity}GB de RAM</strong> dans ${gameState.ramInstalled} slot(s).
          </p>
          <p class="text-gray-600 text-sm mt-3">
            La RAM (Random Access Memory) est la mémoire vive de l'ordinateur. Plus tu en as, plus ton ordinateur peut gérer de tâches simultanément !
          </p>
        </div>

        <div class="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
          <div class="text-3xl mb-3 text-center">🐧</div>
          <h3 class="text-xl font-bold text-orange-800 mb-3 text-center">Linux installé</h3>
          <p class="text-gray-700 text-center">
            Tu as remplacé Windows par <strong>Linux Ubuntu</strong>.
          </p>
          <p class="text-gray-600 text-sm mt-3">
            Linux est un système d'exploitation libre et open-source. Il respecte ta vie privée, est plus sécurisé et totalement gratuit !
          </p>
        </div>

      </div>

      <div class="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
        <h3 class="text-xl font-bold text-blue-800 mb-3">📚 Ce que tu as appris :</h3>
        <ul class="space-y-2 text-gray-700">
          <li>✅ Comment installer de la RAM physiquement dans un ordinateur</li>
          <li>✅ L'importance de la RAM pour les performances système</li>
          <li>✅ Comment remplacer un système d'exploitation</li>
          <li>✅ Les avantages de Linux par rapport aux systèmes propriétaires</li>
          <li>✅ Qu'un logiciel libre respecte ta liberté et ta vie privée</li>
        </ul>
      </div>

      <div class="flex gap-4">
        <button onclick="startGame()" class="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
          🔄 Rejouer
        </button>
        <a href="../index.html" class="flex-1 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 transition shadow-lg text-center">
          🏠 Retour au village
        </a>
      </div>

    </div>
  `;
}

// ----------------------
// Démarrage du jeu
// ----------------------
function startGame() {
  // Réinitialiser l'état
  gameState.currentStep = 0;
  gameState.ramInstalled = 0;
  gameState.ramCapacity = 0;
  gameState.osInstalled = null;
  
  renderRamInstallation();
}

// Initialisation
renderIntro();
