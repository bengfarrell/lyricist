// Simple icon generator for PWA
// Creates basic placeholder icons - replace with your own design later!

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateSVGIcon(size, letter) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2c3e50"/>
  <text x="50%" y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.6}" 
        font-weight="bold"
        fill="#ffffff" 
        text-anchor="middle" 
        dominant-baseline="central">${letter}</text>
</svg>`;
}

// Generate icons
const publicDir = resolve(__dirname, '../public');

const icon192 = generateSVGIcon(192, 'L');
const icon512 = generateSVGIcon(512, 'L');

writeFileSync(resolve(publicDir, 'icon-192.svg'), icon192);
writeFileSync(resolve(publicDir, 'icon-512.svg'), icon512);

console.log('✅ PWA icons generated in public/ folder');
console.log('💡 These are placeholder SVG icons. Replace with PNG for better compatibility!');



