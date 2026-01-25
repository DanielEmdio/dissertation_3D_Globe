/**
 * Script to optimize the GeoJSON file
 * Removes unnecessary properties and geometry data
 * Run with: node scripts/optimize-data.js
 */

const fs = require('fs');

console.log('Loading GeoJSON file...');
const data = JSON.parse(fs.readFileSync('public/data/seismic-risk.geojson', 'utf8'));

console.log(`Original features: ${data.features.length}`);

// Extract only necessary data
const optimized = data.features.map(feature => ({
  lat: feature.properties.lat,
  lng: feature.properties.lon,
  losses: feature.properties.losses,
  fatalities: feature.properties.fatalities,
  buildings: feature.properties.buildings
}));

// Optional: Sample every Nth point to reduce size further
// Uncomment to use sampling
// const SAMPLE_RATE = 5; // Keep every 5th point
// const sampled = optimized.filter((_, index) => index % SAMPLE_RATE === 0);
// console.log(`Sampled features: ${sampled.length}`);

console.log(`Optimized features: ${optimized.length}`);

// Write optimized file
fs.writeFileSync(
  'public/data/seismic-risk-optimized.json',
  JSON.stringify(optimized),
  'utf8'
);

console.log('Optimization complete!');
console.log(`Original size: ${(fs.statSync('public/data/seismic-risk.geojson').size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Optimized size: ${(fs.statSync('public/data/seismic-risk-optimized.json').size / 1024 / 1024).toFixed(2)} MB`);
