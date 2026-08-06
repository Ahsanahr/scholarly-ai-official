/**
 * SCHOLARLY AI — Advanced 3-Tier Match Maker & Deep Research Consultant
 * Tiers:
 * 1. Quick AI Match (50 Credits) — Fast match scoring & top 5 program picks.
 * 2. Deep AI Consultant (250 Credits) — In-depth SWOT, Reach/Target/Safety, Financial Aid & Roadmap.
 * 3. Human + AI Expert Audit (500 PKR) — Deep AI Analysis + Senior Human Consultant Manual Audit.
 */

window.MatchmakerModule = (function() {
    let selectedProfileId = null;
    let profiles = {};
    let currentMatchmakerTier = 'deep'; // 'quick' | 'deep' | 'human'
    let pendingTrxId = null;
    let pendingHumanNotes = '';

    function loadProfiles() {
        try {
            const stored = localStorage.getItem('scholarpath_profiles_v2');
            if (stored) profiles = JSON.parse(stored);
        } catch(e) {
            console.error('Failed to load profiles', e);
        }
    }

    return {
        setTier(tier) {
            currentMatchmakerTier = tier;
            
            // Update UI card borders & styling
            ['quick', 'deep', 'human'].forEach(t => {
                const card = document.getElementById(`mm-tier-card-${t}`);
                if (card) {
                    if (t === tier) {
                        card.style.borderColor = t === 'human' ? '#eab308' : 'var(--accent-primary)';
                        card.style.background = t === 'human' ? 'rgba(234, 179, 8, 0.04)' : 'rgba(79, 70, 229, 0.04)';
                        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                    } else {
                        card.style.borderColor = 'var(--border-color)';
                        card.style.background = 'var(--bg-surface)';
                        card.style.boxShadow = 'none';
                    }
                }
            });

            // Update Action Button
            const btn = document.getElementById('mmExecuteBtn');
            if (btn) {
                if (tier === 'quick') {
                    btn.innerHTML = '⚡ Run Quick AI Match (50 Credits)';
                    btn.style.background = 'linear-gradient(135deg, #4f46e5, #3b82f6)';
                } else if (tier === 'deep') {
                    btn.innerHTML = '🎓 Execute Deep AI Consultant Analysis (250 Credits)';
                    btn.style.background = 'linear-gradient(135deg, #7c4dff, #b026ff)';
                } else if (tier === 'human') {
                    btn.innerHTML = '🌟 Order Human + AI Expert Audit (500 PKR)';
                    btn.style.background = 'linear-gradient(135deg, #eab308, #ca8a04)';
                }
            }
        },

        render(containerId = 'matchmakerContainer') {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Auth Check
            if (window.ScholarAuth && !window.ScholarAuth.isLoggedIn()) {
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:24px;">
                        <div style="background:var(--bg-surface); padding:50px 30px; border-radius:var(--radius-lg); border:1px solid var(--border-color); text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                            <div style="font-size: 3.5rem; margin-bottom: 20px;">🔒</div>
                            <h2 style="font-family:var(--font-display); font-size:2rem; margin-bottom:12px; color:var(--text-primary);">Authentication Required</h2>
                            <p style="color:var(--text-secondary); margin-bottom: 30px; font-size:1.1rem; max-width:550px; margin-left:auto; margin-right:auto;">Please sign in or create an account to access the AI University Match Maker.</p>
                            <button class="btn btn-primary" style="padding:14px 32px; font-size:1.05rem;" onclick="if(window.ScholarAuth) window.ScholarAuth.openModal('login');">Sign In / Register</button>
                        </div>
                    </div>
                `;
                return;
            }

            // Plan Check (Owner bypasses)
            const isOwner = window.ScholarAuth && window.ScholarAuth.isOwner();
            const plan = window.ScholarAuth ? window.ScholarAuth.getUserPlan() : 'free';
            const isPremium = isOwner || plan === 'premium' || plan === 'premier';

            if (!isPremium) {
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:24px;">
                        <div style="background:linear-gradient(135deg, rgba(124, 77, 255, 0.08) 0%, rgba(176, 38, 255, 0.03) 100%); padding:50px 30px; border-radius:var(--radius-xl); border:1px solid rgba(176, 38, 255, 0.3); text-align:center; box-shadow:0 10px 30px rgba(124, 77, 255, 0.08);">
                            <div style="font-size: 3.5rem; margin-bottom: 20px;">💎</div>
                            <span class="sop-pro-badge" style="background:linear-gradient(135deg, #B026FF, #7C4DFF); font-size:0.85rem; padding:6px 16px; margin-bottom:16px; display:inline-block; border-radius:20px; color:#fff; font-weight:700;">PREMIUM FEATURE</span>
                            <h2 style="font-family:var(--font-display); font-size:2.2rem; font-weight:800; margin-bottom:12px; color:var(--text-primary);">AI Match Maker</h2>
                            <p style="color:var(--text-secondary); margin-bottom: 30px; font-size:1.1rem; max-width:620px; margin-left:auto; margin-right:auto; line-height:1.6;">Unlock deep research profile analysis, Safety / Target / Reach university categorization, financial strategy, and credit access with the Premium Tier.</p>
                            <button class="btn btn-primary" style="padding:16px 36px; font-size:1.1rem; background:linear-gradient(135deg, #B026FF, #7C4DFF); border:none; box-shadow:0 8px 24px rgba(176,38,255,0.3);" onclick="if(window.switchView) switchView('pricing');">Upgrade to Premium</button>
                        </div>
                    </div>
                `;
                return;
            }

            loadProfiles();
            const profileKeys = Object.keys(profiles);
            
            if (profileKeys.length === 0) {
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:24px;">
                        <div style="background:var(--bg-surface); padding:40px; border-radius:var(--radius-lg); border:1px solid var(--border-color); text-align:center;">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🤖</div>
                            <h2 style="font-family:var(--font-display); font-size:1.8rem; margin-bottom:10px;">Deep Research Consultant</h2>
                            <p style="color:var(--text-secondary); margin-bottom: 30px; font-size:1.1rem; max-width:600px; margin-left:auto; margin-right:auto;">To generate your personalized Future Strategy, SWOT Analysis, and University Matches, we need your academic profile.</p>
                            <button class="btn btn-primary" style="padding:16px 32px; font-size:1.1rem;" onclick="if(window.switchView) switchView('profile');">Build Your Profile Now</button>
                        </div>
                    </div>
                `;
                return;
            }

            if (!selectedProfileId && profileKeys.length > 0) {
                selectedProfileId = profileKeys[0];
            }

            const profileOptions = profileKeys.map(id => `
                <option value="${id}" ${selectedProfileId === id ? 'selected' : ''}>${this.esc(profiles[id].profileName)} (${this.esc(profiles[id].firstName)} ${this.esc(profiles[id].lastName)})</option>
            `).join('');

            container.innerHTML = `
                <style>
                    .tab-btn { background: transparent; border: none; color: var(--text-secondary); font-size: 1rem; font-weight: 600; padding: 12px 24px; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; }
                    .tab-btn.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }
                    .tab-btn:hover:not(.active) { color: var(--text-primary); }
                    .tab-content { display: none; animation: fadeIn 0.3s ease-out; }
                    .tab-content.active { display: block; }
                    .swot-card { padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); }
                    .swot-s { background: rgba(34, 197, 94, 0.05); border-left: 4px solid var(--status-success); }
                    .swot-w { background: rgba(239, 68, 68, 0.05); border-left: 4px solid var(--status-danger); }
                    .swot-o { background: rgba(59, 130, 246, 0.05); border-left: 4px solid var(--status-info); }
                    .swot-t { background: rgba(245, 158, 11, 0.05); border-left: 4px solid var(--status-warning); }
                    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-left: 10px; }
                    .badge-reach { background: rgba(239, 68, 68, 0.1); color: var(--status-danger); }
                    .badge-target { background: rgba(59, 130, 246, 0.1); color: var(--status-info); }
                    .badge-safety { background: rgba(34, 197, 94, 0.1); color: var(--status-success); }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                </style>
                <div style="display:flex; flex-direction:column; gap:24px;">
                    <!-- Header Banner -->
                    <div style="background:linear-gradient(135deg, var(--bg-surface), var(--bg-elevated)); padding:32px; border-radius:var(--radius-lg); border:1px solid var(--border-color); text-align:center;">
                        <h2 style="font-family:var(--font-display); font-size:2rem; margin-bottom: 12px; font-weight:800; background: -webkit-linear-gradient(45deg, var(--accent-primary), #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI & Human Academic Matchmaker</h2>
                        <p style="font-size:1.1rem; color:var(--text-secondary); max-width: 800px; margin: 0 auto;">Choose your desired intelligence tier—from instant 50-credit quick matches to deep 250-credit AI consulting and 500 PKR Human Expert Audits.</p>
                    </div>

                    <!-- 3-TIER SELECTION CARDS -->
                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:24px; box-shadow: var(--shadow-sm);">
                        <label style="font-size:0.85rem; font-weight: 700; color:var(--text-tertiary); display:block; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px;">1. Select Matchmaker Intelligence Tier</label>
                        
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:24px;">
                            
                            <!-- Tier 1: Quick Match (50 Credits) -->
                            <div id="mm-tier-card-quick" onclick="MatchmakerModule.setTier('quick')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:14px; padding:20px; cursor:pointer; transition:all 0.25s ease;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                    <span style="font-size:1.8rem;">⚡</span>
                                    <span style="background:rgba(79, 70, 229, 0.1); color:var(--accent-primary); padding:4px 10px; border-radius:20px; font-weight:800; font-size:0.75rem;">50 CREDITS</span>
                                </div>
                                <h4 style="margin:0 0 6px 0; font-size:1.1rem; color:var(--text-primary); font-family:var(--font-display);">Quick AI Match</h4>
                                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">Fast eligibility score, top 5 program picks, concise requirements & rapid output.</p>
                            </div>

                            <!-- Tier 2: Deep AI Consultant (250 Credits) -->
                            <div id="mm-tier-card-deep" onclick="MatchmakerModule.setTier('deep')" style="background:rgba(79, 70, 229, 0.04); border:2px solid var(--accent-primary); border-radius:14px; padding:20px; cursor:pointer; transition:all 0.25s ease; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                    <span style="font-size:1.8rem;">🎓</span>
                                    <span style="background:rgba(168, 85, 247, 0.15); color:#a855f7; padding:4px 10px; border-radius:20px; font-weight:800; font-size:0.75rem;">250 CREDITS</span>
                                </div>
                                <h4 style="margin:0 0 6px 0; font-size:1.1rem; color:var(--text-primary); font-family:var(--font-display);">Deep AI Consultant</h4>
                                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">Full SWOT Analysis, Reach/Target/Safety predictions, financial aid & roadmap.</p>
                            </div>

                            <!-- Tier 3: Human + AI Expert Audit (500 PKR) -->
                            <div id="mm-tier-card-human" onclick="MatchmakerModule.setTier('human')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:14px; padding:20px; cursor:pointer; transition:all 0.25s ease;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                    <span style="font-size:1.8rem;">🌟</span>
                                    <span style="background:rgba(234, 179, 8, 0.15); color:#d97706; padding:4px 10px; border-radius:20px; font-weight:800; font-size:0.75rem;">500 PKR MONEY</span>
                                </div>
                                <h4 style="margin:0 0 6px 0; font-size:1.1rem; color:var(--text-primary); font-family:var(--font-display);">Human + AI Expert Audit</h4>
                                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">Deep AI Analysis + Senior Human Consultant Manual Review (Returned in 24-48 Hours).</p>
                            </div>

                        </div>

                        <div style="display:grid; grid-template-columns: 1fr; gap:20px;">
                            <div>
                                <label style="font-size:0.85rem; font-weight: 700; color:var(--text-tertiary); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">2. Profile Foundation</label>
                                <select id="mmProfileSelect" class="form-select" style="width: 100%; padding: 14px; border-radius: 10px; border: 2px solid var(--border-color); background: var(--bg-elevated); color: var(--text-primary); font-size:1rem;" onchange="window.MatchmakerModule.selectProfile(this.value)">
                                    ${profileOptions}
                                </select>
                            </div>
                            <div>
                                <label style="font-size:0.85rem; font-weight: 700; color:var(--text-tertiary); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">3. Future Goals & Preferences (Search Details)</label>
                                <textarea id="mmSearchQuery" class="form-input" style="width: 100%; padding: 16px; border-radius: 10px; border: 2px solid var(--border-color); background: var(--bg-elevated); color: var(--text-primary); min-height: 100px; resize: vertical; font-size:1rem;" placeholder="e.g., I want to study Computer Science in Pakistan, USA or UK. I have a moderate budget and need financial aid..."></textarea>
                            </div>
                            <button id="mmExecuteBtn" class="btn btn-primary" style="padding: 18px; font-size: 1.2rem; font-weight: 800; border-radius: 12px; background: linear-gradient(135deg, #7c4dff, #b026ff); box-shadow: 0 10px 25px rgba(124, 77, 255, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="MatchmakerModule.calculateMatchesAI()">🎓 Execute Deep AI Consultant Analysis (250 Credits)</button>
                        </div>
                    </div>

                    <div id="matchResultsContainer"></div>
                </div>
            `;
        },

        selectProfile(id) {
            selectedProfileId = id;
        },

        esc(str) {
            if (!str) return '';
            return String(str).replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        },

        buildProfileContext(p) {
            let ctx = `Student Name: ${p.firstName} ${p.lastName}\n`;
            ctx += `Demographics: ${p.gender || 'N/A'}, Nationality: ${p.nationality || 'N/A'}, City: ${p.city || 'N/A'}\n\n`;
            
            ctx += `--- EDUCATION ---\n`;
            if (p.educationList && p.educationList.length > 0) {
                p.educationList.forEach(e => {
                    ctx += `- ${e.level}: ${e.degree} at ${e.institution} (${e.startYear}-${e.endYear}). Score: ${e.score}/${e.totalScore}\n`;
                });
            } else {
                ctx += `No education data provided.\n`;
            }

            ctx += `\n--- EXPERIENCE ---\n`;
            if (p.experienceList && p.experienceList.length > 0) {
                p.experienceList.forEach(e => {
                    ctx += `- ${e.role} at ${e.company} (${e.startYear}-${e.endYear || 'Present'})\n`;
                });
            } else {
                ctx += `No professional experience.\n`;
            }

            ctx += `\n--- SKILLS, LANGUAGES & EXTRACURRICULARS ---\n`;
            ctx += `Mother Tongue: ${p.motherTongue || 'N/A'}\n`;
            if (p.otherLanguages && p.otherLanguages.length > 0) {
                ctx += `Other Languages: ${p.otherLanguages.map(l => l.lang + ' (' + l.level + ')').join(', ')}\n`;
            }
            if (p.digitalSkills && p.digitalSkills.length > 0) ctx += `Digital Skills: ${p.digitalSkills.join(', ')}\n`;
            if (p.softSkills && p.softSkills.length > 0) ctx += `Soft Skills: ${p.softSkills.join(', ')}\n`;
            if (p.extracurriculars) ctx += `Extracurriculars: ${p.extracurriculars}\n`;
            if (p.certifications) ctx += `Certifications: ${p.certifications}\n`;
            if (p.futureFieldOfStudy) ctx += `Intended Field: ${p.futureFieldOfStudy}\n`;
            if (p.personalMotive) ctx += `Personal Motive: ${p.personalMotive}\n`;

            return ctx;
        },

        openHumanCheckoutModal() {
            let modal = document.getElementById('mmHumanCheckoutModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'mmHumanCheckoutModal';
                modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; z-index:99999; background:rgba(5, 5, 12, 0.85); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.3s ease;';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div style="background:var(--bg-surface); border:1px solid #eab308; border-radius:24px; max-width:540px; width:100%; padding:32px; box-shadow:0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(234, 179, 8, 0.2); position:relative; animation:scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    <button style="position:absolute; top:20px; right:20px; background:transparent; border:none; color:var(--text-tertiary); font-size:1.5rem; cursor:pointer;" onclick="document.getElementById('mmHumanCheckoutModal').remove()">✕</button>
                    
                    <div style="text-align:center; margin-bottom:24px;">
                        <span style="font-size:3rem;">🌟</span>
                        <h3 style="font-family:var(--font-display); font-size:1.8rem; margin:8px 0 4px 0; color:var(--text-primary);">Human + AI Expert Audit Checkout</h3>
                        <p style="color:var(--text-secondary); font-size:0.95rem; margin:0;">Senior Educational Consultant Review + Deep AI Analysis</p>
                    </div>

                    <!-- Order Summary Box -->
                    <div style="background:rgba(234, 179, 8, 0.08); border:1px dashed #eab308; border-radius:14px; padding:16px 20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:700; color:var(--text-primary); font-size:1rem;">Senior Expert Audit Package</div>
                            <div style="font-size:0.8rem; color:var(--text-secondary);">Turnaround: 24-48 Hours</div>
                        </div>
                        <div style="font-size:1.6rem; font-weight:800; color:#d97706; font-family:var(--font-display);">500 PKR</div>
                    </div>

                    <!-- Payment Accounts Accordion / Options -->
                    <div style="margin-bottom:20px;">
                        <label style="font-size:0.85rem; font-weight:700; color:var(--text-tertiary); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">1. Send 500 PKR to any account below:</label>
                        <div style="display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
                            <div style="background:var(--bg-elevated); padding:12px 16px; border-radius:10px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                                <span>📱 <strong>JazzCash / EasyPaisa:</strong> <code>0300-1234567</code></span>
                                <span style="font-size:0.75rem; color:var(--text-tertiary);">Title: ScholarPath</span>
                            </div>
                            <div style="background:var(--bg-elevated); padding:12px 16px; border-radius:10px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                                <span>🏛️ <strong>Meezan Bank:</strong> <code>01020304050607</code></span>
                                <span style="font-size:0.75rem; color:var(--text-tertiary);">IBAN: PK76MEZN</span>
                            </div>
                        </div>
                    </div>

                    <!-- Transaction Reference ID Input -->
                    <div style="margin-bottom:20px;">
                        <label style="font-size:0.85rem; font-weight:700; color:var(--text-tertiary); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">2. Enter Transaction Reference / TRX ID</label>
                        <input type="text" id="mmTrxInput" class="form-input" style="width:100%; padding:14px; border-radius:10px; border:2px solid var(--border-color); font-size:1rem;" placeholder="e.g. 9840192841 or Payment Receipt No.">
                    </div>

                    <!-- Notes for Consultant -->
                    <div style="margin-bottom:24px;">
                        <label style="font-size:0.85rem; font-weight:700; color:var(--text-tertiary); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">3. Notes for Human Consultant (Optional)</label>
                        <textarea id="mmHumanNotes" class="form-input" style="width:100%; padding:12px; border-radius:10px; border:2px solid var(--border-color); font-size:0.9rem; min-height:60px;" placeholder="Specific questions or preferences for the human consultant..."></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display:flex; gap:12px;">
                        <button class="btn btn-secondary" style="flex:1; padding:14px;" onclick="document.getElementById('mmHumanCheckoutModal').remove()">Cancel</button>
                        <button class="btn btn-primary" style="flex:2; padding:14px; background:linear-gradient(135deg, #eab308, #ca8a04); border:none; font-weight:800; box-shadow:0 8px 24px rgba(234,179,8,0.3);" onclick="MatchmakerModule.confirmHumanOrder()">🚀 Complete Order (500 PKR)</button>
                    </div>
                </div>
            `;
        },

        confirmHumanOrder() {
            const trx = document.getElementById('mmTrxInput')?.value?.trim();
            const notes = document.getElementById('mmHumanNotes')?.value?.trim() || '';

            if (!trx) {
                alert("Please enter your Transaction Reference / TRX ID to complete the order.");
                document.getElementById('mmTrxInput')?.focus();
                return;
            }

            pendingTrxId = trx;
            pendingHumanNotes = notes;

            const modal = document.getElementById('mmHumanCheckoutModal');
            if (modal) modal.remove();

            this.runMatchmakerExecution();
        },

        async calculateMatchesAI() {
            if (!selectedProfileId || !profiles[selectedProfileId]) return alert("Please select or create a profile first.");
            
            // Handle Credit checks based on tier
            if (currentMatchmakerTier === 'quick') {
                if (window.ScholarAuth && !window.ScholarAuth.requirePlan('premium', 'Quick AI Matchmaker')) return;
                this.runMatchmakerExecution();
            } else if (currentMatchmakerTier === 'deep') {
                if (window.ScholarAuth && !window.ScholarAuth.requirePlan('premium', 'Deep AI Consultant')) return;
                this.runMatchmakerExecution();
            } else if (currentMatchmakerTier === 'human') {
                // Launch 500 PKR Checkout Modal
                this.openHumanCheckoutModal();
            }
        },

        async runMatchmakerExecution() {
            const p = profiles[selectedProfileId];
            const query = document.getElementById('mmSearchQuery')?.value || 'Provide a strategic academic plan based on my profile.';
            const container = document.getElementById('matchResultsContainer');

            if (container) {
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 80px 20px; color: var(--text-secondary); background: var(--bg-elevated); border-radius: var(--radius-lg); border: 2px dashed var(--border-color);">
                        <div class="loading-dots" style="margin-bottom: 24px; transform: scale(1.5);"><span></span><span></span><span></span></div>
                        <h3 style="color: var(--text-primary); margin-bottom: 12px; font-size:1.5rem;">
                            ${currentMatchmakerTier === 'quick' ? 'Executing Quick AI Match (50 Credits)...' : currentMatchmakerTier === 'human' ? 'Compiling AI Report & Submitting for Human Audit...' : 'Executing Deep Research Analytics (250 Credits)...'}
                        </h3>
                        <p style="text-align: center; max-width: 500px; font-size: 1.05rem;">Simulating admission probabilities, analyzing global scholarship databases, and evaluating your profile.</p>
                    </div>
                `;
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Quick Match (50 Credits) Prompt Schema
            if (currentMatchmakerTier === 'quick') {
                const quickPrompt = `You are an expert college admissions consultant. Analyze the student profile below and provide a concise, high-speed matching summary.
STUDENT PROFILE:
${this.buildProfileContext(p)}

SEARCH GOALS:
"${query}"

Output ONLY a JSON object (no markdown block wrapper):
{
  "quickInsight": "Concise 2-sentence summary of candidate eligibility.",
  "topMatches": [
    { "name": "University Name", "program": "Degree Program", "location": "City, Country", "matchPercentage": 88, "stream": "Stream", "minReq": "Short minimum requirements", "whyFit": "1-line reason why it fits" }
  ]
}`;

                try {
                    const endpoint = '/api/matchup/secure';
                    let headers = window.ScholarAuth ? await window.ScholarAuth.getAuthHeaders() : { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-bypass' };
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: quickPrompt }] }],
                            generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
                        })
                    });

                    if (!response.ok) throw new Error("API Request failed");
                    const data = await response.json();
                    
                    // Deduct 50 credits
                    if (window.ScholarAuth) window.ScholarAuth.deductLocalCredits(50);

                    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                    let result = JSON.parse(textOutput.replace(/```json/g, '').replace(/```/g, '').trim());
                    this.renderQuickResults(result, container);
                    if (window.showToast) window.showToast('Quick AI Match Complete! (50 Credits)', 'success');
                    return;
                } catch(err) {
                    console.error(err);
                    if (container) container.innerHTML = `<div style="color: var(--status-danger); padding: 24px; background: rgba(239, 68, 68, 0.1); border-radius: 12px;">Failed to complete quick match. ${this.esc(err.message)}</div>`;
                    return;
                }
            }

            // Deep / Human Audit Tier Prompt Schema — Senior Consultant Quality Upgrade
            const prompt = `You are a Senior Ivy-League & Global Admissions Strategist (better than Crimson Education & Premier EdConsult).
Conduct a highly advanced, deeply analytical "Deep Research" candidate audit for the student below based on their Europass academic profile and specific goals.
DO NOT return generic boilerplate text or simple chat responses. Provide high-level, actionable, consultant-grade analysis with precise admission likelihoods, composite formulas, and strategic insights.

STUDENT PROFILE:
${this.buildProfileContext(p)}

STUDENT'S SPECIFIC SEARCH QUERY / GOALS:
"${query}"
${pendingHumanNotes ? `\nCUSTOM NOTES FOR AUDIT:\n"${pendingHumanNotes}"` : ''}

Output your analysis EXACTLY as a JSON object (no markdown formatting blocks, just raw JSON).
The JSON MUST follow this exact schema strictly:
{
  "executiveSummary": {
    "overview": "Comprehensive 3-paragraph senior consultant evaluation of the student's academic stamina, GPA/rank competitiveness, stream alignment, and market potential.",
    "topCareerPath": "The #1 high-growth specialized career niche perfectly aligned with their education and skills."
  },
  "profileSWOT": {
    "strengths": ["Deep granular academic/resume strength 1", "Strength 2", "Strength 3", "Strength 4"],
    "weaknesses": ["Exact GPA/grade/test deficit or gap 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Scholarship/program opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Regional admission bottleneck/competition threat 1", "Threat 2"]
  },
  "universityMatches": {
    "reach": [
      { "name": "University", "program": "Program", "location": "City, Country", "matchPercentage": 55, "whyReach": "Deep strategic assessment of why it's a stretch and how to bridge the gap" },
      { "name": "University", "program": "Program", "location": "City, Country", "matchPercentage": 60, "whyReach": "Deep strategic assessment of why it's a stretch and how to bridge the gap" }
    ],
    "target": [
      { "name": "University", "program": "Program", "location": "City, Country", "matchPercentage": 85, "whyTarget": "Deep analysis of why this fits their profile and closing merit percentage" },
      { "name": "University", "program": "Program", "location": "City, Country", "matchPercentage": 88, "whyTarget": "Deep analysis of why this fits their profile and closing merit percentage" }
    ],
    "safety": [
      { "name": "University", "program": "Program", "location": "City, Country", "matchPercentage": 96, "whySafety": "Guaranteed backup admission analysis" }
    ]
  },
  "financialStrategy": {
    "scholarships": [
      { "name": "Name", "amount": "Coverage & Stipend", "eligibility": "Detailed eligibility reasoning", "deadline": "Expected Deadline" }
    ],
    "roiAnalysis": "Comprehensive ROI breakdown evaluating tuition, living costs, and projected post-grad salary."
  },
  "futureInstructions": {
    "immediateNextSteps": ["Specific action item for next 30 days 1", "Action item 2", "Action item 3"],
    "longTermGoals": ["12-Month milestone 1", "Milestone 2"],
    "skillGapsToClose": ["Technical skill deficit to close 1", "Deficit 2"]
  }
}`;

            try {
                const endpoint = '/api/matchup/secure';
                let headers = window.ScholarAuth ? await window.ScholarAuth.getAuthHeaders() : { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-bypass' };
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        tier: currentMatchmakerTier,
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const detail = (typeof errData.error === 'string') ? errData.error : (errData?.error?.message || response.statusText || response.status);
                    throw new Error(detail);
                }
                
                const data = await response.json();
                
                // Deduct credits locally for deep research
                if (currentMatchmakerTier === 'deep' && window.ScholarAuth) {
                    window.ScholarAuth.deductLocalCredits(250);
                }

                const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                let result = {};
                try {
                    result = JSON.parse(textOutput);
                } catch(e) {
                    result = JSON.parse(textOutput.replace(/```json/g, '').replace(/```/g, '').trim());
                }

                if (currentMatchmakerTier === 'human') {
                    // Save Human Audit Ticket
                    const ticketId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
                    const ticket = {
                        id: ticketId,
                        trxId: pendingTrxId || 'TRX-DEFAULT',
                        notes: pendingHumanNotes,
                        profileName: p.firstName + ' ' + p.lastName,
                        query: query,
                        createdAt: Date.now(),
                        status: 'Pending Expert Review (24-48h)'
                    };
                    try {
                        const existing = JSON.parse(localStorage.getItem('scholarpath_human_audits') || '[]');
                        existing.unshift(ticket);
                        localStorage.setItem('scholarpath_human_audits', JSON.stringify(existing));
                    } catch(e){}

                    // DISPATCH EMAIL TO trazoexplains@gmail.com
                    try {
                        fetch('/api/matchup/human-audit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ticketId,
                                trxId: pendingTrxId,
                                notes: pendingHumanNotes,
                                profile: p,
                                query: query,
                                aiResult: result,
                                userEmail: p.email || (window.ScholarAuth ? window.ScholarAuth.getUserEmail() : '')
                            })
                        }).catch(e => console.warn('Human audit email dispatch note:', e));
                    } catch(e) {}

                    this.renderResults(result, container, ticketId, pendingTrxId);
                    if (window.showToast) window.showToast(`500 PKR Order Confirmed! Ticket #${ticketId}. Notification dispatched to consultant.`, 'success');
                } else {
                    this.renderResults(result, container);
                    if (window.showToast) window.showToast('Deep Research Analysis Complete! (250 Credits)', 'success');
                }
            } catch (err) {
                console.error(err);
                if (container) container.innerHTML = `<div style="color: var(--status-danger); padding: 24px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid var(--status-danger);">Failed to complete deep research. Please try again. (${this.esc(err.message)})</div>`;
            }
        },

        renderQuickResults(data, container) {
            if (!container) return;
            const matches = data.topMatches || [];

            const cardsHtml = matches.map(m => `
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:14px; padding:20px; display:flex; flex-direction:column; gap:12px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color:var(--text-primary); font-size:1.05rem; font-family:var(--font-display); margin:0;">${this.esc(m.name)}</h4>
                        <div style="background:rgba(79, 70, 229, 0.1); color:var(--accent-primary); border:1px solid var(--accent-primary); padding:4px 12px; border-radius:20px; font-weight:800; font-size:0.85rem; white-space:nowrap;">
                            ${m.matchPercentage}% Match
                        </div>
                    </div>
                    <div style="font-size:0.9rem; color:var(--text-secondary);">
                        <strong>Program:</strong> ${this.esc(m.program)} | 📍 ${this.esc(m.location)}
                    </div>
                    <div style="background:var(--bg-elevated); padding:12px; border-radius:10px; font-size:0.82rem; color:var(--text-secondary);">
                        <div><strong>Requirements:</strong> ${this.esc(m.minReq)}</div>
                        <div style="margin-top:4px; color:var(--status-success);"><strong>Why fit:</strong> ${this.esc(m.whyFit)}</div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:32px; box-shadow: var(--shadow-lg); animation: fadeIn 0.4s ease-out;">
                    <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:16px; margin-bottom:24px;">
                        <h3 style="font-family:var(--font-display); font-size:1.5rem; margin:0; color:var(--text-primary); display:flex; align-items:center; gap:10px;">
                            <span>⚡</span> Quick AI Match Results <span style="font-size:0.75rem; background:rgba(79, 70, 229, 0.1); color:var(--accent-primary); padding:4px 10px; border-radius:12px;">50 Credits</span>
                        </h3>
                    </div>

                    <div style="background:rgba(79, 70, 229, 0.05); border:1px solid rgba(79, 70, 229, 0.2); padding:18px; border-radius:12px; margin-bottom:24px; color:var(--text-primary); font-size:1.05rem; line-height:1.6;">
                        💡 <strong>Quick Candidate Insight:</strong> ${this.esc(data.quickInsight)}
                    </div>

                    <h4 style="font-family:var(--font-display); font-size:1.2rem; color:var(--text-primary); margin-bottom:16px;">Top Recommended Programs</h4>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                        ${cardsHtml}
                    </div>
                </div>
            `;
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        switchTab(tabId) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById('btn-' + tabId).classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
        },

        renderResults(data, container, humanTicketId = null, trxId = null) {
            if (!container) return;

            // 1. SWOT HTML
            const swot = data.profileSWOT || {};
            const swotHtml = `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-top:20px;">
                    <div class="swot-card swot-s">
                        <h4 style="color:var(--status-success); margin:0 0 10px 0; font-size:1.1rem; display:flex; align-items:center; gap:8px;"><span>💪</span> Strengths</h4>
                        <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">
                            ${(swot.strengths || []).map(x => `<li style="margin-bottom:6px;">${this.esc(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="swot-card swot-w">
                        <h4 style="color:var(--status-danger); margin:0 0 10px 0; font-size:1.1rem; display:flex; align-items:center; gap:8px;"><span>⚠️</span> Weaknesses</h4>
                        <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">
                            ${(swot.weaknesses || []).map(x => `<li style="margin-bottom:6px;">${this.esc(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="swot-card swot-o">
                        <h4 style="color:var(--status-info); margin:0 0 10px 0; font-size:1.1rem; display:flex; align-items:center; gap:8px;"><span>🎯</span> Opportunities</h4>
                        <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">
                            ${(swot.opportunities || []).map(x => `<li style="margin-bottom:6px;">${this.esc(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="swot-card swot-t">
                        <h4 style="color:var(--status-warning); margin:0 0 10px 0; font-size:1.1rem; display:flex; align-items:center; gap:8px;"><span>🛡️</span> Threats & Competition</h4>
                        <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">
                            ${(swot.threats || []).map(x => `<li style="margin-bottom:6px;">${this.esc(x)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // 2. Universities HTML
            const u = data.universityMatches || {};
            const buildUniCard = (item, type, badgeClass) => `
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:16px; box-shadow: var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                        <div>
                            <h4 style="color:var(--text-primary); font-size:1.15rem; font-family:var(--font-display); margin:0 0 4px 0;">${this.esc(item.name)} <span class="badge ${badgeClass}">${type} (${item.matchPercentage}%)</span></h4>
                            <div style="color:var(--text-secondary); font-size:0.9rem;">📍 ${this.esc(item.location)} | <strong>Program:</strong> ${this.esc(item.program)}</div>
                        </div>
                    </div>
                    <p style="margin:10px 0 0 0; color:var(--text-secondary); font-size:0.95rem; line-height:1.5; background:var(--bg-elevated); padding:12px; border-radius:8px;">
                        <strong>Consultant Assessment:</strong> ${this.esc(item.whyTarget || item.whyReach || item.whySafety)}
                    </p>
                </div>
            `;

            const uniHtml = `
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <h3 style="color:var(--accent-primary); font-size:1.2rem; margin:10px 0; border-bottom:1px solid var(--border-color); padding-bottom:8px;">🎯 Target Schools (Ideal Match)</h3>
                    ${(u.target || []).map(x => buildUniCard(x, 'Target', 'badge-target')).join('')}
                    
                    <h3 style="color:var(--status-danger); font-size:1.2rem; margin:20px 0 10px 0; border-bottom:1px solid var(--border-color); padding-bottom:8px;">🚀 Reach Schools (Ambitious)</h3>
                    ${(u.reach || []).map(x => buildUniCard(x, 'Reach', 'badge-reach')).join('')}
                    
                    <h3 style="color:var(--status-success); font-size:1.2rem; margin:20px 0 10px 0; border-bottom:1px solid var(--border-color); padding-bottom:8px;">🛡️ Safety Schools (High Probability)</h3>
                    ${(u.safety || []).map(x => buildUniCard(x, 'Safety', 'badge-safety')).join('')}
                </div>
            `;

            // 3. Financial Strategy HTML
            const fin = data.financialStrategy || {};
            const scholHtml = (fin.scholarships || []).map(s => `
                <div style="background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:16px;">
                    <h4 style="color:var(--text-primary); font-size:1.1rem; margin:0 0 8px 0;">💰 ${this.esc(s.name)}</h4>
                    <div style="display:flex; gap:20px; margin-bottom:12px; font-size:0.9rem;">
                        <span style="color:var(--status-success); font-weight:700;">Coverage: ${this.esc(s.amount)}</span>
                        <span style="color:var(--status-danger); font-weight:700;">Deadline: ${this.esc(s.deadline)}</span>
                    </div>
                    <p style="margin:0; color:var(--text-secondary); font-size:0.95rem; line-height:1.5;"><strong>Why you qualify:</strong> ${this.esc(s.eligibility)}</p>
                </div>
            `).join('');

            // 4. Action Plan HTML
            const roadmap = data.futureInstructions || {};
            const buildList = (arr, icon) => `<ul style="list-style:none; padding:0; margin:0;">` + (arr || []).map(item => `
                <li style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; padding:16px; background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:12px;">
                    <span style="font-size:1.2rem;">${icon}</span>
                    <span style="color:var(--text-secondary); font-size:1rem; line-height:1.5;">${this.esc(item)}</span>
                </li>
            `).join('') + `</ul>`;

            // Human Audit Banner (if 500 PKR tier)
            let humanBanner = '';
            if (humanTicketId) {
                humanBanner = `
                    <div style="background:linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.08)); border:2px solid #eab308; border-radius:16px; padding:20px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                                <span style="font-size:1.4rem;">🌟</span>
                                <h4 style="margin:0; font-size:1.15rem; color:#d97706; font-family:var(--font-display);">Human + AI Audit Active (500 PKR)</h4>
                                <span style="background:#eab308; color:#fff; font-size:0.75rem; padding:3px 10px; border-radius:12px; font-weight:800;">Ticket #${this.esc(humanTicketId)}</span>
                                ${trxId ? `<span style="background:rgba(234, 179, 8, 0.2); color:#d97706; font-size:0.75rem; padding:3px 10px; border-radius:12px;">TRX: ${this.esc(trxId)}</span>` : ''}
                            </div>
                            <p style="margin:0; font-size:0.9rem; color:var(--text-secondary);">Your AI Match report has been compiled and submitted to a Senior Human Educational Consultant for manual review. Check back in 24-48 hours for expert notes.</p>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <button class="btn btn-primary" style="background:linear-gradient(135deg, #eab308, #ca8a04); border:none; padding:10px 18px; font-size:0.88rem; font-weight:700;" onclick="MatchmakerModule.downloadCurrentAuditPDF('${this.esc(humanTicketId)}')">
                                📥 Download Audit Package (PDF)
                            </button>
                            <div style="background:var(--bg-surface); padding:8px 16px; border-radius:20px; border:1px solid #eab308; font-size:0.85rem; font-weight:700; color:#d97706;">
                                ⏳ Status: Pending Review
                            </div>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                ${humanBanner}
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); overflow:hidden; box-shadow: var(--shadow-lg); animation: fadeIn 0.5s ease-out;">
                    <!-- Tabs Header -->
                    <div style="display:flex; border-bottom:1px solid var(--border-color); background:var(--bg-elevated); overflow-x:auto;">
                        <button id="btn-summary" class="tab-btn active" onclick="MatchmakerModule.switchTab('summary')">1. Exec Summary & SWOT</button>
                        <button id="btn-unis" class="tab-btn" onclick="MatchmakerModule.switchTab('unis')">2. Predictive Matches</button>
                        <button id="btn-finance" class="tab-btn" onclick="MatchmakerModule.switchTab('finance')">3. Financial Strategy</button>
                        <button id="btn-roadmap" class="tab-btn" onclick="MatchmakerModule.switchTab('roadmap')">4. Strategic Roadmap</button>
                    </div>

                    <!-- Tab Contents -->
                    <div style="padding: 32px;">
                        
                        <!-- TAB 1: SUMMARY & SWOT -->
                        <div id="tab-summary" class="tab-content active">
                            <div style="background: linear-gradient(145deg, var(--bg-surface), var(--bg-elevated)); border:1px solid var(--border-color); border-radius:16px; padding:24px; margin-bottom:30px;">
                                <h3 style="font-family:var(--font-display); font-size:1.4rem; margin-bottom:12px; color:var(--text-primary);">🧑‍💼 Consultant's Executive Summary</h3>
                                <p style="font-size:1.1rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${this.esc(data.executiveSummary?.overview)}</p>
                                <div style="display:inline-block; background:rgba(168, 85, 247, 0.1); color:var(--accent-primary); padding:10px 20px; border-radius:8px; font-weight:700; font-size:1rem; border:1px solid var(--accent-primary);">
                                    🚀 Recommended Career Path: ${this.esc(data.executiveSummary?.topCareerPath)}
                                </div>
                            </div>
                            <h3 style="font-family:var(--font-display); font-size:1.4rem; color:var(--text-primary); margin-bottom:10px;">📊 Profile SWOT Analysis</h3>
                            ${swotHtml}
                        </div>

                        <!-- TAB 2: UNIS -->
                        <div id="tab-unis" class="tab-content">
                            <div style="margin-bottom:20px;">
                                <h2 style="font-family:var(--font-display); font-size:1.6rem; margin-bottom:10px;">Your University Match Portfolio</h2>
                                <p style="color:var(--text-secondary); font-size:1.05rem;">We categorized your options into Safety, Target, and Reach to maximize your admission chances.</p>
                            </div>
                            ${uniHtml}
                        </div>

                        <!-- TAB 3: FINANCE -->
                        <div id="tab-finance" class="tab-content">
                            <h2 style="font-family:var(--font-display); font-size:1.6rem; margin-bottom:10px;">Financial Strategy & Scholarships</h2>
                            <div style="background: rgba(59, 130, 246, 0.05); border:1px solid rgba(59, 130, 246, 0.2); padding:20px; border-radius:12px; margin-bottom:24px; color:var(--text-secondary); font-size:1rem; line-height:1.6;">
                                <strong>💡 ROI Consultant Note:</strong> ${this.esc(fin.roiAnalysis)}
                            </div>
                            ${scholHtml}
                        </div>

                        <!-- TAB 4: ROADMAP -->
                        <div id="tab-roadmap" class="tab-content">
                            <h2 style="font-family:var(--font-display); font-size:1.6rem; margin-bottom:24px;">Your Strategic Future Roadmap</h2>
                            
                            <h3 style="color:var(--text-primary); font-size:1.2rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;"><span>⚡</span> Immediate Next Steps (Next 30 Days)</h3>
                            ${buildList(roadmap.immediateNextSteps, '👉')}

                            <h3 style="color:var(--text-primary); font-size:1.2rem; margin:32px 0 16px 0; display:flex; align-items:center; gap:8px;"><span>🎯</span> Long-Term Goals (Next 12 Months)</h3>
                            ${buildList(roadmap.longTermGoals, '📌')}

                            <h3 style="color:var(--status-warning); font-size:1.2rem; margin:32px 0 16px 0; display:flex; align-items:center; gap:8px;"><span>🔧</span> Skill Gaps to Close</h3>
                            ${buildList(roadmap.skillGapsToClose, '🛠️')}
                        </div>

                    </div>
                </div>
            `;
            
            // Scroll to results
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        downloadCurrentAuditPDF(ticketId) {
            if (typeof html2pdf === 'undefined') {
                alert("PDF Engine is loading. Please try again in 2 seconds.");
                return;
            }
            if (!selectedProfileId || !profiles[selectedProfileId]) return alert("No active profile found for PDF download.");
            const p = profiles[selectedProfileId];
            const name = `${p.firstName || 'Student'} ${p.lastName || ''}`.trim();

            const htmlContent = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #1e293b; background: #ffffff; line-height: 1.5;">
                    <div style="border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h1 style="margin: 0; font-size: 24px; color: #4f46e5; font-weight: 800; letter-spacing: 0.5px;">SCHOLARLY AI</h1>
                            <div style="font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Official Candidate Audit Dossier & Matchmaker Report</div>
                        </div>
                        <div style="text-align: right; font-size: 12px; color: #64748b;">
                            <div><strong>Ticket ID:</strong> #${ticketId || 'AUDIT-OFFICIAL'}</div>
                            <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">👤 Student Profile Summary</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                            <div><strong>Full Name:</strong> ${name}</div>
                            <div><strong>Gender / Nationality:</strong> ${p.gender || 'N/A'} / ${p.nationality || 'Pakistani'}</div>
                            <div><strong>City / Location:</strong> ${p.city || 'N/A'}</div>
                            <div><strong>Intended Field:</strong> ${p.futureFieldOfStudy || 'N/A'}</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">🎓 Education History</h3>
                        ${(p.educationList || []).map(e => `
                            <div style="margin-bottom: 8px; font-size: 13px;">
                                <strong>${e.level}: ${e.degree}</strong> at ${e.institution} (${e.startYear}-${e.endYear}) — <span style="color:#4f46e5; font-weight:700;">Score: ${e.score}/${e.totalScore}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">💻 Technical & Soft Skills</h3>
                        <div style="font-size: 13px;">
                            <div><strong>Digital Skills:</strong> ${(p.digitalSkills || []).join(', ')}</div>
                            <div><strong>Certifications:</strong> ${p.certifications || 'None'}</div>
                        </div>
                    </div>
                </div>
            `;

            const opt = {
                margin: 8,
                filename: `${name.replace(/\s+/g, '_')}_Audit_Dossier_${ticketId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(htmlContent).save().then(() => {
                if (window.showToast) window.showToast('Candidate Audit Package PDF downloaded!', 'success');
            });
        }
    };
})();
