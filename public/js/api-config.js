/**
 * SCHOLARLY AI — API & Model Management Engine
 * Manages API keys, model selections (Gemini 2.0 Flash, 1.5 Flash, Google Custom Search 1500 free requests),
 * and local fallback handling.
 */

window.ScholarlyApiConfig = (function() {
    const STORAGE_KEY = 'scholarly_api_settings';

    const defaultSettings = {
        geminiApiKey: '',
        customSearchApiKey: '',
        customSearchEngineId: '',
        selectedModel: 'gemini-2.0-flash', // Default high-speed free model
        enableGoogleSearchGrounding: true
    };

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
        } catch (e) {
            console.warn('Could not load Scholarly API settings:', e);
            return { ...defaultSettings };
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Could not save Scholarly API settings:', e);
        }
    }

    let currentSettings = loadSettings();

    return {
        getSettings() {
            return { ...currentSettings };
        },

        updateSettings(newSettings) {
            currentSettings = { ...currentSettings, ...newSettings };
            saveSettings(currentSettings);
            return currentSettings;
        },

        hasGeminiKey() {
            return Boolean(currentSettings.geminiApiKey && currentSettings.geminiApiKey.trim());
        },

        hasCustomSearchKey() {
            return Boolean(currentSettings.customSearchApiKey && currentSettings.customSearchEngineId);
        },

        /**
         * Perform Google Custom Search (Up to 1500 free queries/day with registered key)
         */
        async searchGoogle(query) {
            if (!this.hasCustomSearchKey()) {
                console.info('Google Custom Search API key not set. Using local knowledge fallback.');
                return null;
            }

            const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(currentSettings.customSearchApiKey)}&cx=${encodeURIComponent(currentSettings.customSearchEngineId)}&q=${encodeURIComponent(query)}`;
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
                const data = await res.json();
                return data.items || [];
            } catch (err) {
                console.error('Google Custom Search failed:', err);
                return null;
            }
        },

        /**
         * Query Gemini API with prompt
         */
        async queryGemini(prompt, systemInstruction = '') {
            if (!this.hasGeminiKey()) {
                throw new Error('Gemini API key is not configured. Please set your key in API Settings.');
            }

            const model = currentSettings.selectedModel || 'gemini-2.0-flash';
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentSettings.geminiApiKey}`;

            const payload = {
                contents: [{ parts: [{ text: prompt }] }]
            };

            if (systemInstruction) {
                payload.systemInstruction = { parts: [{ text: systemInstruction }] };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.error?.message || `Gemini API call failed (${response.status})`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        },

        /**
         * Renders an interactive modal dialog for setting API keys and picking models
         */
        renderSettingsModal() {
            let modal = document.getElementById('scholarlyApiModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'scholarlyApiModal';
                modal.className = 'modal-backdrop';
                document.body.appendChild(modal);
            }

            const s = this.getSettings();
            modal.innerHTML = `
                <div class="modal" style="max-width: 540px;">
                    <div class="modal-header">
                        <h3 class="modal-title">⚙️ API & AI Model Settings</h3>
                        <button class="modal-close" onclick="document.getElementById('scholarlyApiModal').classList.remove('active')">&times;</button>
                    </div>
                    <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
                        <p style="font-size: 0.88rem; color: var(--text-secondary);">
                            Configure your free AI models and specialized Google Search API (1,500 free queries/day).
                        </p>
                        
                        <div class="form-group">
                            <label class="form-label">Google Gemini API Key (Free Tier)</label>
                            <input type="password" id="cfgGeminiKey" class="form-input" placeholder="AIzaSy..." value="${s.geminiApiKey || ''}">
                            <span style="font-size:0.75rem; color:var(--text-tertiary);">Obtain free from Google AI Studio.</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Preferred AI Model</label>
                            <select id="cfgModel" class="form-select">
                                <option value="gemini-2.0-flash" ${s.selectedModel === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash (Recommended / Fast)</option>
                                <option value="gemini-1.5-flash" ${s.selectedModel === 'gemini-1.5-flash' ? 'selected' : ''}>Gemini 1.5 Flash (Standard)</option>
                                <option value="gemini-1.5-pro" ${s.selectedModel === 'gemini-1.5-pro' ? 'selected' : ''}>Gemini 1.5 Pro (Deep Reasoning)</option>
                            </select>
                        </div>

                        <hr style="border: 0; border-top: 1px solid var(--border-subtle);">

                        <div class="form-group">
                            <label class="form-label">Google Custom Search API Key (1,500 Free/Day)</label>
                            <input type="password" id="cfgSearchKey" class="form-input" placeholder="AIzaSy..." value="${s.customSearchApiKey || ''}">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Search Engine ID (CX)</label>
                            <input type="text" id="cfgSearchCx" class="form-input" placeholder="0123456789..." value="${s.customSearchEngineId || ''}">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('scholarlyApiModal').classList.remove('active')">Cancel</button>
                        <button class="btn btn-primary" id="saveApiSettingsBtn">Save Settings</button>
                    </div>
                </div>
            `;

            modal.classList.add('active');

            document.getElementById('saveApiSettingsBtn').onclick = () => {
                const gKey = document.getElementById('cfgGeminiKey').value.trim();
                const model = document.getElementById('cfgModel').value;
                const sKey = document.getElementById('cfgSearchKey').value.trim();
                const sCx = document.getElementById('cfgSearchCx').value.trim();

                this.updateSettings({
                    geminiApiKey: gKey,
                    selectedModel: model,
                    customSearchApiKey: sKey,
                    customSearchEngineId: sCx
                });

                modal.classList.remove('active');
                if (window.showToast) window.showToast('API & Model settings updated successfully!', 'success');
            };
        }
    };
})();
