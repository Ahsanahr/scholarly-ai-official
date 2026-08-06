/**
 * SCHOLARLY AI — Consultant Desk Module
 * Categorized verified educational consultants (Comprehensive vs One-Time Advisory)
 */

window.ConsultantsModule = (function() {
    let comprehensiveConsultants = [];
    let oneTimeConsultants = [];

    fetch("/data/consultants-comp.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { comprehensiveConsultants = data; if(document.getElementById("consultantsContainer")) window.ConsultantsModule.render("consultantsContainer"); }).catch(e => console.error(e));
    fetch("/data/consultants-one.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { oneTimeConsultants = data; if(document.getElementById("consultantsContainer")) window.ConsultantsModule.render("consultantsContainer"); }).catch(e => console.error(e));

    function injectStyles() {
        if (!document.getElementById('consultantStyles')) {
            const style = document.createElement('style');
            style.id = 'consultantStyles';
            style.textContent = `
                .consultant-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .consultant-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: var(--accent-primary);
                }
                .consultant-tab-content {
                    display: none;
                    animation: fadeIn 0.3s ease-in-out;
                }
                .consultant-tab-content.active {
                    display: block;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function renderAddForm() {
        if (!(window.AdminModule && window.AdminModule.isAdmin())) return '';
        
        return `
            <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--accent-primary); margin-bottom:24px;">
                <h3 style="margin-bottom:16px; color:var(--text-primary);">Add New Consultant (Admin)</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                    <input type="text" id="addConsName" placeholder="Name" style="padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <select id="addConsType" style="padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                        <option value="comp">Comprehensive (A-to-Z)</option>
                        <option value="one">One-Time Advisory</option>
                    </select>
                    <input type="text" id="addConsFocus" placeholder="Regions / Expertise" style="padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addConsRating" placeholder="Rating (e.g. 5.0 ★)" value="5.0 ★" style="padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <textarea id="addConsBio" placeholder="Consultant Biography..." style="width:100%; height:80px; margin-bottom:16px; padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);"></textarea>
                <button class="btn btn-primary" onclick="window.ConsultantsModule.addConsultant()">Save New Consultant</button>
            </div>
        `;
    }

    function makeEditableCode(c, type) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<span contenteditable="true" onblur="window.ConsultantsModule.updateCode('${c.name}', '${type}', this.innerText)" style="border:1px dashed var(--accent-primary); padding:2px 8px; border-radius:4px; outline:none;" onfocus="this.style.background='rgba(176, 38, 255, 0.1)'" onblur="this.style.background='transparent'; window.ConsultantsModule.updateCode('${c.name}', '${type}', this.innerText)">${c.discountCode || 'Add Code'}</span>`;
        }
        return `<strong style="color:var(--accent-primary);">${c.discountCode || 'None'}</strong>`;
    }

    function makeEditableText(c, type, field, value) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<div contenteditable="true" onblur="this.style.background='transparent'; window.ConsultantsModule.updateField('${c.name}', '${type}', '${field}', this.innerHTML)" style="border:1px dashed var(--accent-primary); padding:4px; border-radius:4px; outline:none; min-height:20px; text-align:justify;" onfocus="this.style.background='rgba(176, 38, 255, 0.05)'">${value}</div>`;
        }
        return value;
    }

    return {
        render(containerId = 'consultantsContainer') {
            injectStyles();
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const isMobile = window.innerWidth <= 768;

            const adminSaveBtn = (window.AdminModule && window.AdminModule.isAdmin()) 
                ? `<button onclick="window.ConsultantsModule.saveAll()" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:var(--accent-primary); color:white; padding:16px 24px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:none; font-weight:bold; cursor:pointer; font-size:1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">💾 Save All Changes</button>` 
                : '';

            container.innerHTML = `
                ${adminSaveBtn}
                <div style="display:flex; flex-direction:column; gap:24px;">
                    <!-- Top Banner & Tabs -->
                    <div id="consultantsTopBanner" style="display:${isMobile ? 'none' : 'flex'}; background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-color); justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                        <div>
                            <h2 style="font-family:var(--font-display); font-size:1.5rem;">🧑‍💼 Verified Consultant Desk</h2>
                            <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:4px;">Connect with verified experts for complete guidance or one-time targeted advice.</p>
                        </div>
                        <div style="display:flex; gap:12px; flex-wrap:wrap;">
                            <button class="btn btn-primary" id="btn-comprehensive" onclick="ConsultantsModule.switchTab('comprehensive')">🎓 Comprehensive Programs</button>
                            <button class="btn btn-secondary" id="btn-onetime" onclick="ConsultantsModule.switchTab('onetime')">⏱️ One-Time Advisory</button>
                        </div>
                    </div>

                    <!-- Ahsanullah 30-Min Consultation Session Feature Card -->
                    <div style="background:linear-gradient(135deg, rgba(176, 38, 255, 0.08), rgba(124, 77, 255, 0.12)); border:1.5px solid rgba(176, 38, 255, 0.3); border-radius:var(--radius-xl); padding:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; box-shadow:0 8px 24px rgba(176,38,255,0.08);">
                        <div style="max-width:650px;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                                <span style="font-size:1.8rem;">⭐</span>
                                <h3 style="font-family:var(--font-display); font-size:1.4rem; color:var(--text-primary); margin:0;">30-Minute 1-on-1 Consultation with Ahsanullah</h3>
                                <span class="sop-pro-badge" style="background:linear-gradient(135deg, #B026FF, #7C4DFF); color:#fff; font-size:0.75rem; padding:4px 10px; border-radius:12px;">VALUE 2500 PKR</span>
                            </div>
                            <p style="color:var(--text-secondary); font-size:0.95rem; margin:0; line-height:1.5;">Get direct, personalized 1-on-1 university selection and scholarship advisory from lead consultant Ahsanullah.</p>
                        </div>
                        <div>
                            ${(function() {
                                const isOwner = window.ScholarAuth && window.ScholarAuth.isOwner();
                                const plan = window.ScholarAuth ? window.ScholarAuth.getUserPlan() : 'free';
                                const isPremium = isOwner || plan === 'premium' || plan === 'premier';
                                if (isPremium) {
                                    return `<button class="btn btn-primary" style="padding:14px 28px; font-weight:700; background:linear-gradient(135deg, #10b981, #059669); border:none;" onclick="alert('✅ 1 Free Consultation Session Available! Booking system opening: Pick your preferred slot for your 30-minute 1-on-1 call with Ahsanullah.')">📅 Schedule 30-Min Session (Included Free)</button>`;
                                } else {
                                    return `<button class="btn btn-primary" style="padding:14px 28px; font-weight:700; background:linear-gradient(135deg, #B026FF, #7C4DFF); border:none;" onclick="if(window.switchView) switchView('pricing');">🔒 Upgrade to Premium to Claim Session</button>`;
                                }
                            })()}
                        </div>
                    </div>

                    ${renderAddForm()}

                    <!-- Comprehensive Consultants Tab -->
                    <div id="tab-comprehensive" class="consultant-tab-content active">
                        <h3 style="font-family:var(--font-display); margin-bottom:16px; color:var(--text-primary);">🎓 Complete A-to-Z Program Consultants</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
                            ${comprehensiveConsultants.map(c => `
                                <div class="consultant-card">
                                    <div style="display:flex; justify-content:space-between; align-items:start;">
                                        <div>
                                            <h3 style="font-size:1.2rem; color:var(--text-primary); font-family:var(--font-display);">${c.name}</h3>
                                            <span style="font-size:0.85rem; font-weight:500; color:var(--accent-primary); background:var(--accent-subtle); padding:4px 8px; border-radius:4px; display:inline-block; margin-top:6px;">${c.regions}</span>
                                        </div>
                                        <span style="color:var(--status-warning); font-weight:700; font-size:1rem;">${c.rating}</span>
                                    </div>
                                    <div style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${makeEditableText(c, 'comp', 'bio', c.bio)}</div>
                                    
                                    <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                                        <div style="font-size:0.85rem; color:var(--text-secondary);">Discount: ${makeEditableCode(c, 'comp')}</div>
                                        <button class="btn btn-sm btn-primary" onclick="if(window.showToast) window.showToast('Consultation request sent! Check your admin panel later.', 'info')">Request ↗</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- One-Time Consultants Tab -->
                    <div id="tab-onetime" class="consultant-tab-content">
                        <h3 style="font-family:var(--font-display); margin-bottom:16px; color:var(--text-primary);">⏱️ Targeted One-Time Advisory Services</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
                            ${oneTimeConsultants.map(c => `
                                <div class="consultant-card">
                                    <div style="display:flex; justify-content:space-between; align-items:start;">
                                        <div>
                                            <h3 style="font-size:1.2rem; color:var(--text-primary); font-family:var(--font-display);">${c.name}</h3>
                                            <span style="font-size:0.85rem; font-weight:500; color:var(--status-success); background:rgba(16,185,129,0.1); padding:4px 8px; border-radius:4px; display:inline-block; margin-top:6px;">${c.expertise}</span>
                                        </div>
                                        <span style="color:var(--status-warning); font-weight:700; font-size:1rem;">${c.rating}</span>
                                    </div>
                                    <div style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${makeEditableText(c, 'comp', 'bio', c.bio)}</div>
                                    
                                    <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                                        <div style="font-size:0.85rem; color:var(--text-secondary);">Discount: ${makeEditableCode(c, 'one')}</div>
                                        <button class="btn btn-sm btn-primary" onclick="if(window.showToast) window.showToast('Booking request sent! Check your admin panel later.', 'info')">Book ↗</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        },
        updateField(name, type, field, value) {
            if (type === 'comp') {
                const c = comprehensiveConsultants.find(x => x.name === name);
                if (c) c[field] = value;
            } else {
                const c = oneTimeConsultants.find(x => x.name === name);
                if (c) c[field] = value;
            }
        },
        async updateCode(name, type, code) {
            code = code.trim();
            if (code === 'Add Code' || code === 'None') code = '';
            
            if (type === 'comp') {
                const c = comprehensiveConsultants.find(x => x.name === name);
                if (c) c.discountCode = code;
                await window.AdminModule.saveJsonData('consultants-comp', comprehensiveConsultants, true);
            } else {
                const c = oneTimeConsultants.find(x => x.name === name);
                if (c) c.discountCode = code;
                await window.AdminModule.saveJsonData('consultants-one', oneTimeConsultants, true);
            }
        },
        async saveAll() {
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('consultants-comp', comprehensiveConsultants, true);
                await window.AdminModule.saveJsonData('consultants-one', oneTimeConsultants);
            }
        },
        async addConsultant() {
            const name = document.getElementById('addConsName').value;
            const type = document.getElementById('addConsType').value;
            const focus = document.getElementById('addConsFocus').value;
            const rating = document.getElementById('addConsRating').value;
            const bio = document.getElementById('addConsBio').value;

            if (!name || !focus || !bio) {
                alert('Please fill all required fields');
                return;
            }

            const newC = {
                name: name,
                rating: rating,
                bio: bio,
                discountCode: ""
            };

            if (type === 'comp') {
                newC.regions = focus;
                comprehensiveConsultants.push(newC);
                await window.AdminModule.saveJsonData('consultants-comp', comprehensiveConsultants);
            } else {
                newC.expertise = focus;
                oneTimeConsultants.push(newC);
                await window.AdminModule.saveJsonData('consultants-one', oneTimeConsultants);
            }
            this.render('consultantsContainer');
        },
        switchTab(tab) {
            const tabs = ['comprehensive', 'onetime'];
            
            const topBanner = document.getElementById('consultantsTopBanner');
            if (topBanner) {
                if (window.innerWidth <= 768) {
                    topBanner.style.display = 'none';
                } else {
                    topBanner.style.display = 'flex';
                }
            }
            
            tabs.forEach(t => {
                const section = document.getElementById(`tab-${t}`);
                const btn = document.getElementById(`btn-${t}`);
                if (section && btn) {
                    if (t === tab) {
                        section.classList.add('active');
                        btn.classList.replace('btn-secondary', 'btn-primary');
                    } else {
                        section.classList.remove('active');
                        btn.classList.replace('btn-primary', 'btn-secondary');
                    }
                }
            });
        }
    };
})();
