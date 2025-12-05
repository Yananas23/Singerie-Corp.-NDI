// Module pour créer le terrain et l'environnement du village
import * as THREE from 'three';
import { createDirtMaterial, createStoneMaterial, createMountainMaterial } from './textures.js';

export function createTerrain(scene) {
    // Terrain herbeux principal simple
    const groundGeometry = new THREE.CircleGeometry(20, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a7c3d,
        roughness: 0.9,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sol étendu autour
    const extendedGroundGeometry = new THREE.CircleGeometry(60, 64);
    const extendedGroundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d6b2e,
        roughness: 0.9,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const extendedGround = new THREE.Mesh(extendedGroundGeometry, extendedGroundMaterial);
    extendedGround.rotation.x = -Math.PI / 2;
    extendedGround.position.y = -0.1;
    extendedGround.receiveShadow = true;
    scene.add(extendedGround);

    // Chemin en terre au centre avec texture
    const pathGeometry = new THREE.RingGeometry(2, 6, 32);
    const path = new THREE.Mesh(pathGeometry, createDirtMaterial());
    path.rotation.x = -Math.PI / 2;
    path.position.y = 0.02;
    scene.add(path);

    // Palissade autour du village
    createPalisade(scene);
    
    // Arbres autour
    createTreesAround(scene);
    
    // Rochers décoratifs
    createRocksAround(scene);
    
    // Fleurs
    createFlowersAround(scene);
    
    // Cylindre invisible comme barrière
    createBoundaryCylinder(scene);
    
    // Détails supplémentaires à l'extérieur
    createBushesOutside(scene);
    createSmallRocksOutside(scene);
    createGrassPatches(scene);
}

function createPalisade(scene) {
    const poleCount = 200;
    const radius = 20;
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x6B4423,
        roughness: 0.9,
        metalness: 0
    });
    
    // Définir l'angle de la porte d'entrée (face sud-est, vers la caméra initiale)
    const gateAngleStart = (Math.PI * 0.2); // Début ts.google.com/specimen/Happy+Monkey?query=monkde la porte
    const gateAngleEnd = (Math.PI * 0.3);   // Fin de la porte
    
    for (let i = 0; i < poleCount; i++) {
        const angle = (i / poleCount) * Math.PI * 2;
        
        // Sauter les pieux dans la zone de la porte
        if (angle > gateAngleStart && angle < gateAngleEnd) {
            continue;
        }
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const poleHeight = 3 + Math.random() * 0.5;
        const poleGeometry = new THREE.CylinderGeometry(0.15, 0.18, poleHeight, 12);
        const pole = new THREE.Mesh(poleGeometry, woodMaterial);
        
        pole.position.set(x, poleHeight / 2, z);
        pole.castShadow = true;
        scene.add(pole);
        
        // Pointe du pieu
        const tipGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
        const tip = new THREE.Mesh(tipGeometry, woodMaterial);
        tip.position.set(x, poleHeight + 0.25, z);
        tip.castShadow = true;
        scene.add(tip);
    }
    
    // Créer les poteaux de la porte (centrés sur l'angle de la porte)
    const gatePostHeight = 4.5;
    const gateWidth = 3.5;
    const gateAngleCenter = (gateAngleStart + gateAngleEnd) / 2;
    
    // Calculer la position centrale de la porte
    const gateCenterX = Math.cos(gateAngleCenter) * radius;
    const gateCenterZ = Math.sin(gateAngleCenter) * radius;
    
    // Vecteur perpendiculaire pour espacer les poteaux
    const perpAngle = gateAngleCenter - Math.PI / 2;
    const offsetX = Math.cos(perpAngle) * (gateWidth / 2);
    const offsetZ = Math.sin(perpAngle) * (gateWidth / 2);
    
    // Poteau gauche
    const leftPostGeometry = new THREE.CylinderGeometry(0.25, 0.28, gatePostHeight, 12);
    const leftPost = new THREE.Mesh(leftPostGeometry, woodMaterial);
    leftPost.position.set(gateCenterX - offsetX, gatePostHeight/2, gateCenterZ - offsetZ);
    leftPost.castShadow = true;
    scene.add(leftPost);
    
    // Poteau droit
    const rightPost = new THREE.Mesh(leftPostGeometry, woodMaterial);
    rightPost.position.set(gateCenterX + offsetX, gatePostHeight/2, gateCenterZ + offsetZ);
    rightPost.castShadow = true;
    scene.add(rightPost);
    
    // Poutre horizontale au-dessus de la porte
    const beamGeometry = new THREE.BoxGeometry(gateWidth + 0.5, 0.3, 0.3);
    const beam = new THREE.Mesh(beamGeometry, woodMaterial);
    beam.position.set(gateCenterX, gatePostHeight, gateCenterZ);
    beam.rotation.y = perpAngle + Math.PI / 2;
    beam.castShadow = true;
    scene.add(beam);
    
    // Panneau décoratif au-dessus de la porte
    // Fond en bois
    const signBackGeometry = new THREE.BoxGeometry(2, 0.8, 0.1);
    const signBack = new THREE.Mesh(signBackGeometry, woodMaterial);
    signBack.position.set(gateCenterX, gatePostHeight + 0.6, gateCenterZ);
    signBack.rotation.y = perpAngle + Math.PI / 2;
    signBack.castShadow = true;
    scene.add(signBack);
    
    // Image du panneau (légèrement devant)
    const signImageGeometry = new THREE.BoxGeometry(1.9, 0.7, 0.05);
    const signTexture = new THREE.TextureLoader().load('media/panneau.png');
    signTexture.colorSpace = THREE.SRGBColorSpace;
    const signImageMaterial = new THREE.MeshStandardMaterial({
        map: signTexture,
        roughness: 0.7,
        metalness: 0
    });
    const signImage = new THREE.Mesh(signImageGeometry, signImageMaterial);
    // Calculer la position légèrement devant le fond
    const offsetDistance = 0.08;
    const offsetAngle = perpAngle + Math.PI / 2;
    signImage.position.set(
        gateCenterX + Math.cos(offsetAngle) * offsetDistance,
        gatePostHeight + 0.6,
        gateCenterZ + Math.sin(offsetAngle) * offsetDistance
    );
    signImage.rotation.y = perpAngle + Math.PI / 2;
    signImage.castShadow = true;
    scene.add(signImage);
}

function createTreesAround(scene) {
    const treePositions = [
        { x: 28, z: 12 }, { x: -30, z: 15 }, { x: 25, z: -18 }, { x: -28, z: -14 },
        { x: 22, z: 28 }, { x: -24, z: 26 }, { x: 26, z: -24 }, { x: -22, z: -28 },
        { x: 0, z: 35 }, { x: 0, z: -32 }, { x: 35, z: 0 }, { x: -35, z: 0 },
        { x: 30, z: 22 }, { x: -32, z: 20 }, { x: 28, z: -25 }, { x: -30, z: -22 }
    ];

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x4d3319,
        roughness: 0.9,
        metalness: 0
    });

    treePositions.forEach(pos => {
        const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 5, 12);
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(pos.x, 2.5, pos.z);
        trunk.castShadow = true;
        scene.add(trunk);

        const foliageGeometry = new THREE.ConeGeometry(2.5, 5, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d5016,
            roughness: 0.8,
            metalness: 0
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(pos.x, 6.5, pos.z);
        foliage.castShadow = true;
        scene.add(foliage);
        
        // Deuxième niveau de feuillage
        const foliage2 = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage2.position.set(pos.x, 8, pos.z);
        foliage2.scale.set(0.7, 0.7, 0.7);
        foliage2.castShadow = true;
        scene.add(foliage2);
    });
}

function createRocksAround(scene) {
    const rockPositions = [
        { x: 24, z: 18 }, { x: -26, z: 10 }, { x: 20, z: -24 },
        { x: -22, z: -12 }, { x: 28, z: 8 }, { x: -24, z: -20 }, { x: 18, z: 30 },
        { x: -20, z: 28 }, { x: 32, z: -10 }, { x: -28, z: 24 }
    ];

    const stoneMat = createStoneMaterial();

    rockPositions.forEach(pos => {
        const rockGeometry = new THREE.DodecahedronGeometry(1 + Math.random() * 0.8, 1);
        const rock = new THREE.Mesh(rockGeometry, stoneMat);
        rock.position.set(pos.x, 0.5, pos.z);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        scene.add(rock);
    });
}

function createBoundaryCylinder(scene) {
    const cylinderGeometry = new THREE.CylinderGeometry(60, 60, 30, 64, 1, true);
    
    const texture = new THREE.TextureLoader().load('media/fond_ecran.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(-1, 1);
    texture.offset.set(0, 0);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const cylinderMaterial = new THREE.MeshBasicMaterial({
        map: texture, 
        side: THREE.DoubleSide
    });
    
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cylinder.position.y = 14.7;
    scene.add(cylinder);
}

function createBushesOutside(scene) {
    // Buissons dispersés dans la zone extérieure
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 38 + Math.random() * 18;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        const bushSize = 0.6 + Math.random() * 0.8;
        const bushGeometry = new THREE.SphereGeometry(bushSize, 8, 6);
        const bushMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d5016,
            roughness: 0.85,
            metalness: 0
        });
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.set(x, bushSize * 0.5, z);
        bush.scale.y = 0.6;
        bush.castShadow = true;
        scene.add(bush);
    }
}

function createSmallRocksOutside(scene) {
    // Petits rochers éparpillés
    for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 38 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        const rockSize = 0.3 + Math.random() * 0.5;
        const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.95,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, rockSize * 0.5, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        scene.add(rock);
    }
}

function createGrassPatches(scene) {
    // Touffes d'herbe haute
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 38 + Math.random() * 18;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        // Créer plusieurs brins d'herbe groupés
        for (let j = 0; j < 5; j++) {
            const offsetX = (Math.random() - 0.5) * 0.3;
            const offsetZ = (Math.random() - 0.5) * 0.3;
            
            const grassHeight = 0.4 + Math.random() * 0.3;
            const grassGeometry = new THREE.ConeGeometry(0.02, grassHeight, 3);
            const grassMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x3d6b2e,
                roughness: 0.9,
                metalness: 0
            });
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.set(x + offsetX, grassHeight / 2, z + offsetZ);
            grass.rotation.z = (Math.random() - 0.5) * 0.2;
            scene.add(grass);
        }
    }
}

function createFlowersAround(scene) {
    const flowerColors = [0xff69b4, 0xffff00, 0xff6347, 0x9370db, 0xffa500, 0xff1493];
    
    for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 22 + Math.random() * 15;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        // Tige
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4);
        const stemMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d5016,
            roughness: 0.7,
            metalness: 0
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(x, 0.2, z);
        scene.add(stem);
        
        // Fleur
        const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        const flowerGeometry = new THREE.SphereGeometry(0.08, 6, 6);
        const flowerMaterial = new THREE.MeshStandardMaterial({ 
            color: flowerColor,
            roughness: 0.5,
            metalness: 0,
            emissive: flowerColor,
            emissiveIntensity: 0.2
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(x, 0.45, z);
        flower.scale.y = 0.6;
        scene.add(flower);
    }
}
