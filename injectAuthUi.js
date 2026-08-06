const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, 'public/dashboard.html');
let html = fs.readFileSync(dashPath, 'utf8');

// 1. Replace Profile button with Login button
const profileStr = `<div onclick="switchView('profile-cv')" style="display:flex; align-items:center; gap:8px; background:var(--bg-surface); border:1px solid var(--border-color); padding:6px 14px; border-radius:var(--radius-full); cursor:pointer;" title="View Gamified Profile & CV Exporter">
                    <span style="font-size:1.1rem;">👤</span>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">Profile</span>
                    <span style="background:var(--accent-subtle); color:var(--accent-primary); font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:var(--radius-full);">80%</span>
                </div>`;

const loginStr = `<div data-auth-trigger="login" style="display:flex; align-items:center; gap:8px; background:var(--bg-surface); border:1px solid var(--border-color); padding:6px 14px; border-radius:var(--radius-full); cursor:pointer;" title="Login to your account">
                    <span style="font-size:1.1rem;">👤</span>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">Login</span>
                </div>`;

if (html.includes(profileStr)) {
    html = html.replace(profileStr, loginStr);
} else {
    // Try a more relaxed replacement if spacing is off
    html = html.replace(/<div onclick="switchView\('profile-cv'\)"[^>]*>[\s\S]*?<\/div>/i, loginStr);
}

// 2. Add auth modal before </body>
const authModalHtml = `
    <!-- Auth Modal -->
    <div id="authBackdrop" class="auth-backdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center;">
        <div class="auth-modal" style="background:var(--bg-surface); border-radius:var(--radius-lg); padding:30px; width:90%; max-width:400px; position:relative; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <button id="authCloseBtn" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-secondary);">&times;</button>
            <div style="margin-bottom:20px;">
                <h3 style="color:var(--text-primary); margin-bottom:10px;">Welcome</h3>
                <div style="display:flex; gap:10px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                    <button id="tabLogin" class="auth-tab active" style="background:none; border:none; font-weight:600; color:var(--accent-primary); cursor:pointer; padding:5px 10px;">Login</button>
                    <button id="tabSignup" class="auth-tab" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; padding:5px 10px;">Sign Up</button>
                </div>
            </div>
            <div id="authAlert" style="display:none; padding:10px; border-radius:4px; margin-bottom:15px; font-size:0.9rem;"></div>
            <form id="authForm" style="display:flex; flex-direction:column; gap:15px;">
                <div id="authNameGroup" style="display:none;">
                    <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">Full Name</label>
                    <input type="text" id="authName" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <div>
                    <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">Email</label>
                    <input type="text" id="authEmail" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <div>
                    <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:5px;">Password</label>
                    <input type="password" id="authPassword" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <button type="submit" class="btn btn-primary" style="padding:12px; font-weight:600;">Continue</button>
            </form>
        </div>
    </div>
`;

if (!html.includes('id="authBackdrop"')) {
    html = html.replace('</body>', authModalHtml + '\n</body>');
}

// 3. Add auth.js script tag
if (!html.includes('<script src="js/auth.js"></script>')) {
    html = html.replace('</body>', '    <script src="js/auth.js"></script>\n</body>');
}

fs.writeFileSync(dashPath, html, 'utf8');
console.log('dashboard.html modified successfully.');
