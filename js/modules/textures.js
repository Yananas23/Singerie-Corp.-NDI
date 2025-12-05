// Module pour créer des textures procédurales réalistes
import * as THREE from 'three';

// Générateur de bruit simplifié pour textures réalistes
class NoiseGenerator {
    static random2D(x, y) {
        return Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
    }
    
    static perlin(x, y) {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const xf = x - xi;
        const yf = y - yi;
        
        const u = xf * xf * (3.0 - 2.0 * xf);
        const v = yf * yf * (3.0 - 2.0 * yf);
        
        const a = this.random2D(xi, yi);
        const b = this.random2D(xi + 1, yi);
        const c = this.random2D(xi, yi + 1);
        const d = this.random2D(xi + 1, yi + 1);
        
        return a * (1 - u) * (1 - v) +
               b * u * (1 - v) +
               c * (1 - u) * v +
               d * u * v;
    }
    
    static fbm(x, y, octaves = 4) {
        let value = 0;
        let amplitude = 0.5;
        let frequency = 1;
        
        for (let i = 0; i < octaves; i++) {
            value += amplitude * this.perlin(x * frequency, y * frequency);
            frequency *= 2;
            amplitude *= 0.5;
        }
        return value;
    }
}

export function createThatchMaterial(baseColor = 0xDAA520) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    const color = new THREE.Color(baseColor);
    const baseR = color.r * 255;
    const baseG = color.g * 255;
    const baseB = color.b * 255;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            
            // Texture de paille avec bruit
            const noise = NoiseGenerator.fbm(x * 0.08, y * 0.08, 3);
            const straw = NoiseGenerator.fbm(x * 0.2, y * 0.05, 2);
            
            const variation = (noise + straw) * 0.5;
            
            data[i] = Math.floor(baseR + variation * 60 - 30);
            data[i + 1] = Math.floor(baseG + variation * 60 - 30);
            data[i + 2] = Math.floor(baseB + variation * 40 - 20);
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Brins de paille détaillés
    for (let i = 0; i < 3000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = Math.random() * 15 + 8;
        const angle = Math.random() * 0.4 - 0.2;
        const brightness = Math.random() * 80 - 40;
        
        ctx.strokeStyle = `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness * 0.8}, 0.3)`;
        ctx.lineWidth = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.95,
        metalness: 0,
        bumpMap: texture,
        bumpScale: 1.2
    });
}

export function createStoneMaterial() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            
            // Texture de pierre avec plusieurs octaves de bruit
            const noise = NoiseGenerator.fbm(x * 0.03, y * 0.03, 5);
            const detail = NoiseGenerator.fbm(x * 0.15, y * 0.15, 3);
            
            const value = (noise * 0.7 + detail * 0.3) * 255;
            const base = 100;
            
            const final = Math.floor(base + value * 0.4);
            
            data[i] = final;
            data[i + 1] = final;
            data[i + 2] = final;
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Fissures et détails
    for (let i = 0; i < 40; i++) {
        const startX = Math.random() * size;
        const startY = Math.random() * size;
        
        ctx.strokeStyle = `rgba(40, 40, 40, ${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        let x = startX;
        let y = startY;
        for (let j = 0; j < 5; j++) {
            x += (Math.random() - 0.5) * 40;
            y += (Math.random() - 0.5) * 40;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.95,
        metalness: 0.05,
        bumpMap: texture,
        bumpScale: 0.8
    });
}

export function createDirtMaterial() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            
            // Terre avec variations
            const noise = NoiseGenerator.fbm(x * 0.05, y * 0.05, 4);
            const detail = NoiseGenerator.fbm(x * 0.2, y * 0.2, 2);
            
            const variation = (noise + detail * 0.5) * 0.5;
            
            data[i] = Math.floor(100 + variation * 80);
            data[i + 1] = Math.floor(80 + variation * 60);
            data[i + 2] = Math.floor(50 + variation * 50);
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Petits cailloux
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(${120 + Math.random() * 40}, ${110 + Math.random() * 30}, ${90 + Math.random() * 20}, 0.6)`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.95,
        metalness: 0,
        bumpMap: texture,
        bumpScale: 0.4
    });
}

export function createMountainMaterial() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            
            // Roche montagneuse avec strates
            const strata = Math.sin(y * 0.1 + NoiseGenerator.fbm(x * 0.02, y * 0.02, 2) * 5) * 0.5 + 0.5;
            const noise = NoiseGenerator.fbm(x * 0.04, y * 0.04, 4);
            
            const value = (strata * 0.6 + noise * 0.4);
            const base = 60;
            
            const final = Math.floor(base + value * 80);
            
            data[i] = final;
            data[i + 1] = final;
            data[i + 2] = final;
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
        bumpMap: texture,
        bumpScale: 3
    });
}
