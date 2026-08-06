const fs = require('fs');
const file = 'public/dashboard.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div id="authNavContainer"[\s\S]*?<\/div>\s*<\/div>\s*<\/nav>/i;

const replacement = `<div id="authNavContainer" style="display:flex; align-items:center; gap:12px;">
                <button class="btn-theme-toggle" id="creditToggle" onclick="switchView('pricing')" style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); border-radius:var(--radius-full); padding:6px 12px; font-size:0.8rem; cursor:pointer; display:none; align-items:center; gap:6px;" title="Check your remaining credits">
                    <span id="creditIcon">🪙</span> <span id="creditLabel">15 Credits</span>
                </button>
                <button class="btn-theme-toggle" id="themeToggle" onclick="toggleTheme()" style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); border-radius:var(--radius-full); padding:6px 12px; font-size:0.8rem; cursor:pointer; display:flex; align-items:center; gap:6px;">
                    <span id="themeIcon">☀️</span> Light Mode
                </button>
                <div id="navLoginBtn" data-auth-trigger="login" style="display:flex; align-items:center; gap:8px; background:var(--bg-surface); border:1px solid var(--border-color); padding:6px 14px; border-radius:var(--radius-full); cursor:pointer;" title="Login to your account">
                    <span style="font-size:1.1rem;">👤</span>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">Login</span>
                </div>
            </div>
        </div>
    </nav>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully replaced authNavContainer');
} else {
    console.log('Could not find authNavContainer to replace');
}
