const fs = require('fs');
const path = require('path');

const targetScript = path.join(__dirname, 'build-exact-500-cs.js');
let content = fs.readFileSync(targetScript, 'utf8');

// Load sections from complete-sections-7-to-10.js
const secPath = path.join(__dirname, 'complete-sections-7-to-10.js');
const secContent = fs.readFileSync(secPath, 'utf8');

// Extract the s6, osBank, endBank arrays from secContent
content += "\n" + secContent;
fs.writeFileSync(targetScript, content);
console.log('Successfully combined all 500 CS questions into build-exact-500-cs.js!');
