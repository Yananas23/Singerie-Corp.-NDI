// Script principal pour la scène Three.js du village gaulois
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createTerrain } from './modules/terrain.js';
import { createVillageHuts } from './modules/huts.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let huts = [];
let currentHoveredHut = null;
let popupElement;

function init() {
    // Cacher le message de chargement
    const loading = document.getElementById('loading');
    
    // Création de la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Bleu ciel
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.008); // Brouillard exponentiel pour plus de réalisme

    // Caméra
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(25, 20, 25);
    camera.lookAt(0, 0, 0);

    // Renderer avec paramètres réalistes
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.physicallyCorrectLights = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Contrôles de la caméra
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.target.set(0, 0, 0);

    // Raycaster pour détecter les clics
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Récupérer l'élément popup
    popupElement = document.getElementById('hut-popup');

    // Lumières
    setupLights();

    // Créer le terrain et l'environnement du village
    createTerrain(scene);

    // Créer le village avec ses huttes
    const villageHuts = createVillageHuts(scene);
    
    // Stocker les huttes pour l'interaction
    if (villageHuts && villageHuts.huts) {
        huts = villageHuts.huts;
    }

    // Ajouter animation pour les drapeaux
    if (villageHuts && villageHuts.flags) {
        villageHuts.flags.forEach(flag => {
            if (!scene.userData.animations) scene.userData.animations = [];
            scene.userData.animations.push(() => {
                flag.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
                flag.position.x = 0.7 + Math.sin(Date.now() * 0.003) * 0.05;
            });
        });
    }

    // Ajouter des éléments décoratifs
    addDecorations();

    // Cacher le chargement avec transition
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 500);
    }

    // Gestion du redimensionnement
    window.addEventListener('resize', onWindowResize, false);
    
    // Gestion des clics sur les huttes
    window.addEventListener('click', onMouseClick, false);
    window.addEventListener('mousemove', onMouseMove, false);

    // Animation
    animate();
}

function setupLights() {
    // Lumière ambiante douce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Lumière directionnelle principale (soleil)
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    directionalLight.position.set(30, 40, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -80;
    directionalLight.shadow.camera.right = 80;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.bias = -0.0005;
    directionalLight.shadow.radius = 2;
    scene.add(directionalLight);

    // Lumière d'appoint chaude
    const fillLight = new THREE.DirectionalLight(0xffcc88, 0.4);
    fillLight.position.set(-20, 25, -15);
    scene.add(fillLight);

    // Lumière hémisphérique pour un éclairage naturel
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x3d6b2e, 0.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // Lumière d'accentuation pour le village
    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 30, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function addDecorations() {
    // Feu de camp au centre du village
    createCampfire(scene, 0, 0, -5);

    // Quelques tonneaux
    createBarrel(scene, 5, 0, 3);
    createBarrel(scene, -4, 0, 4);
    createBarrel(scene, 3, 0, -6);
}

function createCampfire(scene, x, y, z) {
    const group = new THREE.Group();

    // Cercle de pierres
    const stoneCount = 12;
    const stoneRadius = 1.2;
    
    for (let i = 0; i < stoneCount; i++) {
        const angle = (i / stoneCount) * Math.PI * 2;
        const stoneX = Math.cos(angle) * stoneRadius;
        const stoneZ = Math.sin(angle) * stoneRadius;
        
        const stoneGeometry = new THREE.DodecahedronGeometry(0.3, 0);
        const stoneMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            roughness: 0.9,
            metalness: 0.1
        });
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        stone.position.set(stoneX, 0.15, stoneZ);
        stone.rotation.set(Math.random(), Math.random(), Math.random());
        group.add(stone);
    }

    // Bûches
    const logPositions = [
        { x: 0.5, z: 0, rotation: 0 },
        { x: -0.5, z: 0, rotation: 0 },
        { x: 0, z: 0.5, rotation: Math.PI / 2 }
    ];

    logPositions.forEach(pos => {
        const logGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
        const logMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4d3319,
            roughness: 0.9,
            metalness: 0
        });
        const log = new THREE.Mesh(logGeometry, logMaterial);
        log.position.set(pos.x, 0.3, pos.z);
        log.rotation.z = Math.PI / 2;
        log.rotation.y = pos.rotation;
        group.add(log);
    });

    // Flammes avec dégradé
    const flameGeometry = new THREE.ConeGeometry(0.3, 1.2, 4);
    const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 0.8;
    group.add(flame);

    // Flamme intérieure plus claire
    const innerFlameGeometry = new THREE.ConeGeometry(0.2, 1, 4);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.9
    });
    const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    innerFlame.position.y = 0.7;
    group.add(innerFlame);

    // Lumière du feu avec ombres
    const fireLight = new THREE.PointLight(0xff6600, 2, 10);
    fireLight.position.set(0, 1, 0);
    fireLight.castShadow = true;
    fireLight.shadow.mapSize.width = 512;
    fireLight.shadow.mapSize.height = 512;
    group.add(fireLight);

    group.position.set(x, y, z);
    scene.add(group);

    // Animation de la flamme
    function animateFlame() {
        flame.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
        flame.rotation.y += 0.02;
        innerFlame.scale.y = 1 + Math.sin(Date.now() * 0.007) * 0.25;
        innerFlame.rotation.y -= 0.03;
        fireLight.intensity = 1.5 + Math.sin(Date.now() * 0.003) * 0.5;
    }
    
    // Stocker la fonction d'animation pour l'appeler dans la boucle principale
    if (!scene.userData.animations) scene.userData.animations = [];
    scene.userData.animations.push(animateFlame);
}

function createBarrel(scene, x, y, z) {
    const barrelGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.8, 16);
    const barrelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.85,
        metalness: 0
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.position.set(x, y + 0.4, z);
    barrel.castShadow = true;
    
    // Cerclages du tonneau
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.38, 0.03, 8, 16);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c2c2c,
            roughness: 0.6,
            metalness: 0.4
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(x, y + 0.2 + i * 0.25, z);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
    }
    
    scene.add(barrel);
}

function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}

function onMouseMove(event) {
    // Calculer la position de la souris en coordonnées normalisées
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Vérifier si on survole une hutte
    raycaster.setFromCamera(mouse, camera);
    
    let foundHut = null;
    
    for (let hut of huts) {
        const intersects = raycaster.intersectObject(hut, true);
        if (intersects.length > 0) {
            foundHut = hut;
            break;
        }
    }
    
    if (foundHut && foundHut.userData.showPopup !== false) {
        document.body.style.cursor = 'pointer';
        currentHoveredHut = foundHut;
        
        // Calculer la position 2D de la hutte
        const tempVector = new THREE.Vector3(
            foundHut.position.x,
            foundHut.userData.hutType === 'central' ? 10 : 6,
            foundHut.position.z
        );
        const pos = toScreenPosition({ position: tempVector, updateMatrixWorld: () => {}, matrixWorld: new THREE.Matrix4().setPosition(tempVector) }, camera, renderer);
        
        // Afficher la popup en haut à droite
        popupElement.style.display = 'block';
        
        // Position fixe en haut à droite avec marge responsive
        const marginTop = window.innerWidth < 480 ? '10px' : window.innerWidth < 768 ? '15px' : '20px';
        const marginRight = window.innerWidth < 480 ? '10px' : window.innerWidth < 768 ? '15px' : '20px';
        
        popupElement.style.left = 'auto';
        popupElement.style.right = marginRight;
        popupElement.style.top = marginTop;
        popupElement.style.transform = 'none';
        
        // Mettre à jour le texte et le logo
        const textElement = popupElement.querySelector('.popup-text');
        const iconElement = popupElement.querySelector('.popup-icon');
        if (textElement) {
            textElement.textContent = foundHut.userData.name || 'Cliquez pour entrer';
        }
        if (iconElement && foundHut.userData.logo) {
            iconElement.textContent = foundHut.userData.logo;
        }
    } else {
        document.body.style.cursor = 'default';
        currentHoveredHut = null;
        popupElement.style.display = 'none';
    }
}

function onMouseClick(event) {
    // Calculer la position de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster
    raycaster.setFromCamera(mouse, camera);

    // Vérifier les intersections avec les huttes
    huts.forEach(hut => {
        const intersects = raycaster.intersectObject(hut, true);
        if (intersects.length > 0 && hut.userData.clickable) {
            // Ouvrir l'URL associée à la hutte
            if (hut.userData.url) {
                window.location.href = hut.userData.url;
            }
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Exécuter les animations personnalisées
    if (scene.userData.animations) {
        scene.userData.animations.forEach(anim => anim());
    }
    
    // La popup reste en position fixe en haut à droite, pas besoin de mise à jour

    controls.update();
    
    // Limiter la caméra à l'intérieur du cylindre
    const radius = 58; // Rayon du cylindre - marge
    const distanceFromCenter = Math.sqrt(
        camera.position.x * camera.position.x + 
        camera.position.z * camera.position.z
    );
    
    if (distanceFromCenter > radius) {
        const angle = Math.atan2(camera.position.z, camera.position.x);
        camera.position.x = Math.cos(angle) * radius;
        camera.position.z = Math.sin(angle) * radius;
    }
    
    // Limiter la hauteur
    if (camera.position.y > 28) camera.position.y = 28;
    if (camera.position.y < 1) camera.position.y = 1;
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Démarrer l'application
init();
