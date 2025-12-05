// Module pour créer les huttes gauloises
import * as THREE from 'three';
import { createThatchMaterial } from './textures.js';

export function createHut(scene, x, z, color = 0xDAA520) {
    const hutGroup = new THREE.Group();

    // Murs de la hutte avec texture procédurale
    const wallGeometry = new THREE.CylinderGeometry(2.5, 2.5, 3, 16);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xD2B48C,
        roughness: 0.9,
        metalness: 0
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 1.5;
    walls.castShadow = true;
    walls.receiveShadow = true;
    hutGroup.add(walls);

    // Poutres verticales pour plus de réalisme
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x4d3319,
        roughness: 0.9,
        metalness: 0
    });
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const beamGeometry = new THREE.BoxGeometry(0.15, 3, 0.15);
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(
            Math.cos(angle) * 2.5,
            1.5,
            Math.sin(angle) * 2.5
        );
        beam.castShadow = true;
        hutGroup.add(beam);
    }

    // Toit conique en chaume avec texture
    const roofGeometry = new THREE.ConeGeometry(3.2, 3, 16);
    const roof = new THREE.Mesh(roofGeometry, createThatchMaterial(color));
    roof.position.y = 4.5;
    roof.castShadow = true;
    hutGroup.add(roof);

    // Porte en bois simple
    const doorGeometry = new THREE.BoxGeometry(1, 1.8, 0.15);
    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.9,
        metalness: 0
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.9, 2.55);
    door.castShadow = true;
    hutGroup.add(door);

    // Planches horizontales sur la porte
    for (let i = 0; i < 3; i++) {
        const plankGeometry = new THREE.BoxGeometry(1.1, 0.08, 0.05);
        const plank = new THREE.Mesh(plankGeometry, doorMaterial);
        plank.position.set(0, 0.3 + i * 0.6, 2.62);
        hutGroup.add(plank);
    }

    // Poignée de porte
    const handleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x332200,
        roughness: 0.7,
        metalness: 0.3
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0.3, 0.9, 2.55);
    hutGroup.add(handle);


    hutGroup.position.set(x, 0, z);
    hutGroup.userData.clickable = true;
    hutGroup.userData.hutType = 'standard';
    scene.add(hutGroup);
    
    return hutGroup;
}

export function createCentralHut(scene) {
    // Hutte du chef (plus grande et détaillée)
    const hutGroup = new THREE.Group();

    // Murs plus larges avec segments
    const wallGeometry = new THREE.CylinderGeometry(3.5, 3.5, 4, 16);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xD2B48C,
        roughness: 0.9,
        metalness: 0
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    hutGroup.add(walls);

    // Poutres décoratives
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x4d3319,
        roughness: 0.9,
        metalness: 0
    });
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const beamGeometry = new THREE.BoxGeometry(0.2, 4, 0.2);
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(
            Math.cos(angle) * 3.5,
            2,
            Math.sin(angle) * 3.5
        );
        beam.castShadow = true;
        hutGroup.add(beam);
    }

    // Toit plus imposant
    const roofGeometry = new THREE.ConeGeometry(4.5, 4, 16);
    const roof = new THREE.Mesh(roofGeometry, createThatchMaterial(0xB8860B));
    roof.position.y = 6;
    roof.castShadow = true;
    hutGroup.add(roof);

    // Bannière au sommet avec mât en bois
    const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 12);
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.9,
        metalness: 0
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 9;
    pole.castShadow = true;
    hutGroup.add(pole);

    // Boule décorative au sommet du mât
    const topGeometry = new THREE.SphereGeometry(0.15, 12, 12);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        roughness: 0.3,
        metalness: 0.8
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 10;
    hutGroup.add(top);

    const flagGeometry = new THREE.PlaneGeometry(1.4, 1.1);
    const flagMaterial = new THREE.MeshStandardMaterial({ 
        map: new THREE.TextureLoader().load('media/Drapeau_Singe.png'),
        side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(0.7, 9.3, 0);
    flag.castShadow = true;
    hutGroup.add(flag);
    
    // Porte double plus large
    const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.15);
    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.9,
        metalness: 0
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.25, 3.55);
    door.castShadow = true;
    hutGroup.add(door);

    // Détails de porte
    for (let i = 0; i < 4; i++) {
        const plankGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.05);
        const plank = new THREE.Mesh(plankGeometry, doorMaterial);
        plank.position.set(0, 0.2 + i * 0.6, 3.62);
        hutGroup.add(plank);
    }

    hutGroup.position.set(0, 0, 0);
    hutGroup.userData.clickable = true;
    hutGroup.userData.hutType = 'central';
    scene.add(hutGroup);
    
    // Retourner le groupe et le drapeau pour animation
    return { group: hutGroup, flag: flag };
}

export function createVillageHuts(scene) {
    // Disposition des huttes en cercle autour de la hutte centrale
    const hutPositions = [
        { x: 8, z: 8, color: 0xDAA520, name: 'Forge', url: 'games/pc-upgrade.html', showPopup: true, logo: '⚒️' },
        { x: -8, z: 8, color: 0xD2691E, name: 'Ecole de Langues', url: 'games/alternatives.html', showPopup: true, logo: '💬' },
        { x: 8, z: -8, color: 0xCD853F, name: 'Ecole de Musique', url: 'crt3d.html', showPopup: true, logo: '🎵' },
        { x: -8, z: -8, color: 0xDAA520, name: 'Crédit', url: 'credits.html', showPopup: true, logo: '©' },
        { x: 12, z: 0, color: 0xD2691E, name: '', url: '#', showPopup: false, logo: '' },
        { x: -12, z: 0, color: 0xCD853F, name: '', url: '#', showPopup: false, logo: '' },
        { x: 0, z: 12, color: 0xDAA520, name: '', url: '#', showPopup: false, logo: '' },
        { x: 0, z: -12, color: 0xD2691E, name: '', url: '#', showPopup: false, logo: '' }
    ];

    // Créer la hutte centrale du chef
    const centralHutData = createCentralHut(scene);
    centralHutData.group.userData.name = 'Direction';
    centralHutData.group.userData.showPopup = true;
    centralHutData.group.userData.url = 'chief.html';
    centralHutData.group.userData.logo = '👑';

    // Créer les huttes du village
    const huts = [];
    hutPositions.forEach(pos => {
        const hut = createHut(scene, pos.x, pos.z, pos.color);
        hut.userData.name = pos.name;
        hut.userData.showPopup = pos.showPopup;
        hut.userData.url = pos.url;
        hut.userData.logo = pos.logo;
        huts.push(hut);
    });

    // Retourner les drapeaux et les huttes pour l'interaction
    return {
        flags: centralHutData.flag ? [centralHutData.flag] : [],
        huts: [centralHutData.group, ...huts]
    };
}
