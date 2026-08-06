const fs = require('fs');
const path = require('path');

const authPath = path.join(__dirname, 'public/js/auth.js');
let authCode = fs.readFileSync(authPath, 'utf8');

const targetStr = `async handleFormSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById('authEmail');
        const passInput = document.getElementById('authPassword');
        const nameInput = document.getElementById('authName');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value : '';
        const name = nameInput ? nameInput.value.trim() : '';`;

const replaceStr = `async handleFormSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById('authEmail');
        const passInput = document.getElementById('authPassword');
        const nameInput = document.getElementById('authName');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value : '';
        const name = nameInput ? nameInput.value.trim() : '';

        // Admin login intercept
        if (email === 'trazoexplains' && password === 'Ahsan123$') {
            localStorage.setItem('scholarly_admin', 'true');
            alert('Admin access granted. Reloading...');
            location.reload();
            return;
        }`;

if (authCode.includes(targetStr)) {
    authCode = authCode.replace(targetStr, replaceStr);
    fs.writeFileSync(authPath, authCode, 'utf8');
    console.log('auth.js modified successfully.');
} else {
    // try to match using regex just in case spaces are off
    const regex = /async handleFormSubmit\(e\) \{[\s\S]*?const name = nameInput \? nameInput\.value\.trim\(\) : '';/;
    if (regex.test(authCode)) {
        authCode = authCode.replace(regex, replaceStr);
        fs.writeFileSync(authPath, authCode, 'utf8');
        console.log('auth.js modified successfully with regex.');
    } else {
        console.log('Target string not found in auth.js!');
    }
}
