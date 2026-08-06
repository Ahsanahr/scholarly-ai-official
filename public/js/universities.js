/**
 * SCHOLARLY AI — Universities Hub Module
 * Master-Detail Architecture.
 */

window.UniversitiesModule = (function() {
    let selectedUniId = null;

    let unis = [];
    // Load data dynamically
    fetch("/data/universities.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { unis = data; if(document.getElementById("universitiesContainer")) window.UniversitiesModule.render("universitiesContainer"); }).catch(e => console.error("Error loading unis", e));

    function makeEditable(id, field, value) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (!isAdmin) return value;
        return `<div contenteditable="true" 
            onblur="this.style.background='transparent'; window.UniversitiesModule.updateField('${id}', '${field}', this.innerHTML)" 
            style="border: 1px dashed var(--accent-primary); padding:4px; border-radius:4px; min-height: 20px; outline:none; transition: background 0.2s;"
            onfocus="this.style.background='rgba(176, 38, 255, 0.05)'">${value}</div>`;
    }

    function renderAddForm() {
        if (!(window.AdminModule && window.AdminModule.isAdmin())) return '';
        
        return `
            <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-xl); border:1px solid var(--accent-primary); margin-bottom:24px; box-shadow:0 4px 20px rgba(176,38,255,0.1);">
                <h3 style="margin-bottom:16px; color:var(--accent-primary); font-family:var(--font-display); font-size:1.3rem;">➕ Add New University (Admin)</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:16px;">
                    <input type="text" id="addUniName" placeholder="University Name *" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniLogo" placeholder="Logo Emoji (e.g. 🏛️)" value="🏛️" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniEst" placeholder="Est. Year (e.g. 1991)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniQs" placeholder="QS Ranking (e.g. #300 Global)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniHec" placeholder="HEC Ranking (e.g. #1 Engineering)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniDeadline" placeholder="Admission Deadline (e.g. July 30, 2026)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addUniPortal" placeholder="Official Website URL (https://...)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                    <textarea id="addUniOverview" placeholder="Overview / Description..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addUniPrograms" placeholder="Offered Programs..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addUniFees" placeholder="Fee Structure / Financial Details..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                </div>
                <button class="btn btn-primary" onclick="window.UniversitiesModule.addUniversity()" style="padding:12px 24px; font-weight:bold; border-radius:8px;">Save New University</button>
            </div>
        `;
    }

    function renderMasterList() {
        let html = `
            <div style="display:flex; flex-direction:column; gap:24px;">
                <div style="background:var(--bg-surface); padding:30px; border-radius:var(--radius-xl); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
                    <div style="max-width: 600px;">
                        <h2 style="font-family:var(--font-display); font-size:1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">🏛️ University Explorer</h2>
                        <p style="font-size:0.95rem; color:var(--text-secondary); line-height: 1.5;">Click on any university below to read a comprehensive, detailed guide covering all their programs, fee structures, facilities, and admission processes.</p>
                    </div>
                    <button class="btn btn-primary" style="padding: 12px 24px; font-size: 1rem; box-shadow: 0 4px 14px var(--accent-glow);" onclick="switchView('calculator')">🧮 Open Merit Calculator</button>
                </div>

                ${renderAddForm()}

                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
        `;

        unis.forEach(u => {
            html += `
                <div onclick="openUniDetail('${u.id}')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px; display:flex; flex-direction:column; gap:12px; cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='var(--accent-primary)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none'; this.style.borderColor='var(--border-color)';">
                    
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="font-size:2rem;">${u.logo || '🏛️'}</div>
                        <span style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:4px 8px; border-radius:var(--radius-full); font-size:0.7rem; font-weight: 600; color: var(--text-secondary);">Est. ${u.established}</span>
                    </div>

                    <h3 style="font-size:1.1rem; color:var(--text-primary); font-family:var(--font-display); font-weight: 700; line-height: 1.3; margin:0;">${u.name}</h3>
                    
                    <div style="margin-top:auto; font-size:0.85rem; color:var(--accent-primary); font-weight:600; display:flex; align-items:center; gap:4px;">
                        Read Complete Article <span style="font-size:1rem;">➔</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
        return html;
    }

    function renderDetailView(uni) {
        // Fallback checks for non-detailed batches
        const overviewHtml = makeEditable(uni.id, 'overview', uni.overview || '<p style="color:var(--text-secondary);">Detailed comprehensive overview for this university will be loaded in the upcoming data batch.</p>');
        const programsHtml = makeEditable(uni.id, 'detailedPrograms', uni.detailedPrograms || '<p style="color:var(--text-secondary);">Program list expanding soon.</p>');
        const feesHtml = makeEditable(uni.id, 'detailedFees', uni.detailedFees || '<p style="color:var(--text-secondary);">Detailed fee breakdown expanding soon.</p>');
        const resourcesHtml = makeEditable(uni.id, 'campusResources', uni.campusResources || '<p style="color:var(--text-secondary);">Campus resource details expanding soon.</p>');
        
        const entryTestHtml = makeEditable(uni.id, 'entryTest', uni.entryTest || '');
        const meritHtml = makeEditable(uni.id, 'meritCalculation', uni.meritCalculation || '');
        const docsHtml = makeEditable(uni.id, 'documents', uni.documents || '');
        const scholarshipsHtml = makeEditable(uni.id, 'detailedScholarships', uni.detailedScholarships || `<span style="color:var(--text-secondary); line-height:1.5;">${uni.scholarships}</span>`);

        const adminSaveBtn = (window.AdminModule && window.AdminModule.isAdmin()) 
            ? `<button onclick="window.UniversitiesModule.saveAll()" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:var(--accent-primary); color:white; padding:16px 24px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:none; font-weight:bold; cursor:pointer; font-size:1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">💾 Save All Changes</button>` 
            : '';

        return `
            ${adminSaveBtn}
            <div style="display:flex; flex-direction:column; gap:24px; animation: fadeIn 0.4s ease-out;">
                
                <!-- Header / Back Navigation -->
                <div style="display:flex; align-items:center; gap:16px;">
                    <button onclick="closeUniDetail()" class="btn btn-outline" style="padding: 8px 16px; border-radius: 8px; font-weight: 600;">
                        ← Back to List
                    </button>
                    <div style="flex:1;"></div>
                    <button onclick="if(window.TimelineModule) { window.TimelineModule.onItemSaved({ title: '${uni.name}', type: 'University', deadline: '${uni.admissionDeadline || ''}' }); }" class="btn btn-outline" style="padding: 8px 16px; border-radius: 8px; font-weight: 600; border-color: var(--accent-primary); color: var(--accent-primary);">
                        📌 Track in Timeline
                    </button>
                    <a href="${uni.portal}" target="_blank" class="btn btn-primary" style="padding: 8px 16px; border-radius: 8px; font-weight: 600;">Visit Official Website ↗</a>
                </div>

                <!-- Hero Section -->
                <div style="background:linear-gradient(135deg, var(--bg-surface), var(--bg-elevated)); padding:40px; border-radius:var(--radius-xl); border:1px solid var(--border-color); box-shadow: 0 4px 24px rgba(0,0,0,0.05); position:relative; overflow:hidden;">
                    <div style="position:relative; z-index:2;">
                        <div style="font-size:3rem; margin-bottom:16px;">${uni.logo || '🏛️'}</div>
                        <h1 style="font-family:var(--font-display); font-size:2.4rem; font-weight: 900; color: var(--text-primary); margin-bottom: 12px; line-height:1.2;">
                            ${uni.name}
                        </h1>
                        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
                            ${uni.admissionDeadline ? `<span style="background:rgba(255, 60, 60, 0.1); border:1px solid rgba(255, 60, 60, 0.2); padding:6px 12px; border-radius:var(--radius-full); font-size:0.85rem; font-weight: 700; color: #ff3c3c;">⏰ Deadline: ${uni.admissionDeadline}</span>` : ''}
                            <span style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:6px 12px; border-radius:var(--radius-full); font-size:0.85rem; font-weight: 600; color: var(--text-secondary);">Established: ${uni.established}</span>
                            <span style="background:rgba(176, 38, 255, 0.1); border:1px solid rgba(176, 38, 255, 0.2); padding:6px 12px; border-radius:var(--radius-full); font-size:0.85rem; font-weight: 600; color: var(--accent-primary);">QS Ranking: ${uni.qsRanking}</span>
                            <span style="background:rgba(38, 176, 255, 0.1); border:1px solid rgba(38, 176, 255, 0.2); padding:6px 12px; border-radius:var(--radius-full); font-size:0.85rem; font-weight: 600; color: #1e88e5;">HEC Ranking: ${uni.hecRanking}</span>
                        </div>
                    </div>
                </div>

                <!-- Content Grid -->
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px;">
                    
                    <!-- Main Article Column -->
                    <div style="display:flex; flex-direction:column; gap:24px;">
                        
                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:30px;">
                            <h2 style="font-family:var(--font-display); font-size:1.6rem; color:var(--text-primary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">Overview</h2>
                            ${overviewHtml}
                        </div>

                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:30px;">
                            <h2 style="font-family:var(--font-display); font-size:1.6rem; color:var(--text-primary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">Programs Offered</h2>
                            ${programsHtml}
                        </div>

                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:30px;">
                            <h2 style="font-family:var(--font-display); font-size:1.6rem; color:var(--text-primary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">Campus & Resources</h2>
                            ${resourcesHtml}
                        </div>

                    </div>

                    <!-- Sidebar Info Column -->
                    <div style="display:flex; flex-direction:column; gap:24px;">
                        
                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:24px;">
                            <h3 style="font-family:var(--font-display); font-size:1.3rem; color:var(--text-primary); margin-bottom:16px;">Admissions & Merit</h3>
                            <div style="display:flex; flex-direction:column; gap:16px; font-size:0.9rem;">
                                <div>
                                    <strong style="color:var(--text-primary); display:block; margin-bottom:4px;">📝 Entry Test:</strong>
                                    <span style="color:var(--text-secondary); line-height:1.5;">${entryTestHtml}</span>
                                </div>
                                <div style="background: rgba(176, 38, 255, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid var(--accent-primary);">
                                    <strong style="color:var(--accent-primary); display:block; margin-bottom:4px;">🧮 Merit Formula:</strong>
                                    <span style="color:var(--text-secondary); font-weight:600;">${meritHtml}</span>
                                </div>
                                <div>
                                    <strong style="color:var(--text-primary); display:block; margin-bottom:4px;">📎 Required Documents:</strong>
                                    <span style="color:var(--text-secondary); line-height:1.5;">${docsHtml}</span>
                                </div>
                            </div>
                        </div>

                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:24px;">
                            <h3 style="font-family:var(--font-display); font-size:1.3rem; color:var(--text-primary); margin-bottom:16px;">Finances</h3>
                            ${feesHtml}
                            
                            <div style="margin-top:20px; border-top:1px solid var(--border-color); padding-top:16px;">
                                <strong style="color:var(--text-primary); display:block; margin-bottom:12px; font-size:1.1rem;">🏆 Scholarships & Financial Aid</strong>
                                ${scholarshipsHtml}
                            </div>

                            <div style="margin-top:20px; background:rgba(255, 152, 0, 0.1); border:1px solid rgba(255, 152, 0, 0.2); border-radius:8px; padding:12px;">
                                <p style="font-size:0.8rem; color:var(--text-tertiary); margin:0; line-height:1.5;">
                                    <strong>⚠️ Important Disclaimer:</strong> This information is valid based on our research and historical data, but you should strictly visit their official websites for the 100% accurate and up-to-date fee structures and policies.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        `;
    }

    // Merge AI Scraped data from window.UniversitiesData into the Hub!
    if (window.UniversitiesData && Array.isArray(window.UniversitiesData)) {
        window.UniversitiesData.forEach(aiUni => {
            // Only add if it's a full enriched article, not just a basic stub
            if (aiUni.programs && !unis.find(u => u.id === aiUni.id)) {
                unis.push({
                    id: aiUni.id,
                    name: aiUni.name || 'University',
                    established: aiUni.since || 'N/A',
                    qsRanking: aiUni.ranking || 'N/A',
                    hecRanking: 'N/A',
                    logo: '🏛️',
                    overview: `<p style="font-size:1.05rem; line-height:1.7; color:var(--text-secondary);">${aiUni.introduction || ''}</p>`,
                    detailedPrograms: Array.isArray(aiUni.programs) 
                        ? `<ul style="color:var(--text-secondary); padding-left:20px; line-height:1.6; font-size:0.9rem;">${aiUni.programs.map(p => `<li style="margin-bottom:6px;">${p}</li>`).join('')}</ul>` 
                        : `<p style="color:var(--text-secondary);">${aiUni.programs || ''}</p>`,
                    campusResources: `<p style="color:var(--text-secondary);">${aiUni.hostel || 'Information not specified'}</p>`,
                    detailedFees: `<div style="background: rgba(38, 176, 255, 0.05); padding: 16px; border-radius: 8px; border-left: 3px solid #1e88e5;"><p style="color:var(--text-secondary); margin:0; line-height:1.6;">${aiUni.fee_structure || 'Information not specified'}</p></div>`,
                    entryTest: aiUni.requirements || 'N/A',
                    meritCalculation: 'N/A',
                    documents: 'N/A',
                    scholarships: 'N/A'
                });
            }
        });
    }

    return {
        getAll() {
            return unis;
        },
        getUniById(id) {
            return unis.find(u => u.id === id);
        },
        searchByQuery(query) {
            const q = query.toLowerCase().trim();
            const words = q.split(/\s+/).filter(w => w.length > 1);
            let best = null;
            let bestScore = 0;
            
            unis.forEach(u => {
                const name = (u.name || '').toLowerCase().trim();
                const id = (u.id || '').toLowerCase().trim();
                if (!name) return;
                
                let score = 0;
                if (name === q || id === q) {
                    score = 100;
                } else if (name.startsWith(q) || id.startsWith(q)) {
                    score = 90;
                } else if (name.includes(q) || id.includes(q)) {
                    score = 70;
                } else {
                    const matchCount = words.filter(w => name.includes(w) || id.includes(w)).length;
                    if (matchCount > 0 && words.length > 0) {
                        const ratio = matchCount / words.length;
                        if (ratio >= 0.5) score = Math.round(ratio * 40);
                    }
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    best = u;
                }
            });
            
            return bestScore >= 40 ? { item: best, score: bestScore } : null;
        },
        getRenderMasterList() {
            return renderMasterList();
        },
        getRenderDetailView(uni) {
            return renderDetailView(uni);
        },
        addDynamically(aiUni) {
            const existingIndex = unis.findIndex(u => u.id === aiUni.id);
            if (existingIndex !== -1) {
                unis[existingIndex] = { ...unis[existingIndex], ...aiUni };
            } else {
                unis.push(aiUni);
            }
        },
        updateField(id, field, value) {
            const u = unis.find(x => x.id === id);
            if (u) u[field] = value;
        },
        async saveAll() {
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('universities', unis);
            }
        },
        async addUniversity() {
            const name = document.getElementById('addUniName')?.value?.trim();
            if (!name) {
                alert('Please enter a University Name');
                return;
            }

            const logo = document.getElementById('addUniLogo')?.value?.trim() || '🏛️';
            const established = document.getElementById('addUniEst')?.value?.trim() || 'N/A';
            const qsRanking = document.getElementById('addUniQs')?.value?.trim() || 'N/A';
            const hecRanking = document.getElementById('addUniHec')?.value?.trim() || 'N/A';
            const deadline = document.getElementById('addUniDeadline')?.value?.trim() || '';
            const portal = document.getElementById('addUniPortal')?.value?.trim() || '#';
            const overview = document.getElementById('addUniOverview')?.value?.trim() || '';
            const programs = document.getElementById('addUniPrograms')?.value?.trim() || '';
            const fees = document.getElementById('addUniFees')?.value?.trim() || '';

            const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);

            const newUni = {
                id: id,
                name: name,
                logo: logo,
                established: established,
                qsRanking: qsRanking,
                hecRanking: hecRanking,
                admissionDeadline: deadline,
                portal: portal,
                overview: overview ? `<p style="font-size:1.05rem; line-height:1.7; color:var(--text-secondary);">${overview}</p>` : '<p style="color:var(--text-secondary);">Overview expanding soon.</p>',
                detailedPrograms: programs ? `<p style="color:var(--text-secondary); line-height:1.6;">${programs}</p>` : '<p style="color:var(--text-secondary);">Programs list expanding soon.</p>',
                detailedFees: fees ? `<div style="background: rgba(38, 176, 255, 0.05); padding: 16px; border-radius: 8px; border-left: 3px solid #1e88e5;"><p style="color:var(--text-secondary); margin:0; line-height:1.6;">${fees}</p></div>` : '<p style="color:var(--text-secondary);">Fee breakdown expanding soon.</p>',
                campusResources: '<p style="color:var(--text-secondary);">Campus resource details expanding soon.</p>',
                entryTest: 'Check official website',
                meritCalculation: 'N/A',
                documents: 'Standard academic transcripts',
                scholarships: 'Available'
            };

            unis.push(newUni);
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('universities', unis);
            }
            this.render('universitiesContainer');
        },
        render(containerId = 'universitiesContainer') {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Global handlers
            window.openUniDetail = (id) => {
                selectedUniId = id;
                this.render(containerId);
                // Scroll to top upon opening detail
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            window.closeUniDetail = () => {
                selectedUniId = null;
                this.render(containerId);
            };

            if (selectedUniId) {
                const uni = unis.find(u => u.id === selectedUniId);
                container.innerHTML = renderDetailView(uni);
            } else {
                container.innerHTML = renderMasterList();
            }
        }
    };
})();
