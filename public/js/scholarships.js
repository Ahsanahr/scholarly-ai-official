/**
 * SCHOLARLY AI — Scholarships Hub Module
 * Database of national and international scholarship schemes.
 */

window.ScholarshipsModule = (function() {
    
    // Fallback in case script didn't load properly, but generally relies on window.ScholarshipsData
    const getScholarships = () => window.ScholarshipsData || [];

    let currentFilters = {
        search: '',
        degreeLevel: 'All',
        coverage: 'All'
    };

    function makeEditableText(id, field, value) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<div contenteditable="true" onblur="this.style.background='transparent'; window.ScholarshipsModule.updateField('${id}', '${field}', this.innerHTML)" style="border:1px dashed var(--accent-primary); padding:4px; border-radius:4px; outline:none; min-height:20px; text-align:justify;" onfocus="this.style.background='rgba(176, 38, 255, 0.05)'">${value}</div>`;
        }
        return value;
    }

    function renderAddForm() {
        if (!(window.AdminModule && window.AdminModule.isAdmin())) return '';
        
        return `
            <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-xl); border:1px solid var(--accent-primary); margin-bottom:24px; box-shadow:0 4px 20px rgba(176,38,255,0.1);">
                <h3 style="margin-bottom:16px; color:var(--accent-primary); font-family:var(--font-display); font-size:1.3rem;">➕ Add New Scholarship (Admin)</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:16px;">
                    <input type="text" id="addSchTitle" placeholder="Scholarship Title *" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addSchCountry" placeholder="Country (e.g. Pakistan, USA)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addSchProvider" placeholder="Provider (e.g. HEC, PEEF)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <select id="addSchDegree" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                        <option value="All">All Degrees</option>
                    </select>
                    <select id="addSchCoverage" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                        <option value="Fully Funded">Fully Funded</option>
                        <option value="Need-based">Need-based</option>
                        <option value="Partial">Partial</option>
                    </select>
                    <input type="text" id="addSchDeadline" placeholder="Deadline (e.g. August 15, 2026)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addSchWebsite" placeholder="Official Website URL (https://...)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                    <textarea id="addSchDesc" placeholder="Description..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addSchBenefits" placeholder="Financial Benefits & Coverage..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addSchEligibility" placeholder="Eligibility Criteria..." style="width:100%; height:70px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                </div>
                <button class="btn btn-primary" onclick="window.ScholarshipsModule.addScholarship()" style="padding:12px 24px; font-weight:bold; border-radius:8px;">Save New Scholarship</button>
            </div>
        `;
    }

    function renderFilters() {
        return `
            <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-color); margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <input type="text" id="schSearch" placeholder="Search by name or provider..." style="flex: 1; min-width: 250px; background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-color); padding:10px 16px; border-radius:8px;" onkeyup="window.ScholarshipsModule.updateFilter('search', this.value)">
                    
                    <select id="schDegree" style="background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-color); padding:10px 16px; border-radius:8px; min-width: 150px;" onchange="window.ScholarshipsModule.updateFilter('degreeLevel', this.value)">
                        <option value="All">All Degrees</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                    </select>

                    <select id="schCoverage" style="background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-color); padding:10px 16px; border-radius:8px; min-width: 150px;" onchange="window.ScholarshipsModule.updateFilter('coverage', this.value)">
                        <option value="All">All Coverages</option>
                        <option value="Fully Funded">Fully Funded</option>
                        <option value="Need-based">Need-based</option>
                        <option value="Partial">Partial</option>
                    </select>
                </div>
            </div>
        `;
    }

    function renderModal() {
        return `
            <div id="schModalOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; padding:20px; backdrop-filter: blur(5px);">
                <div id="schModalContent" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:32px; max-width:800px; width:100%; max-height:90vh; overflow-y:auto; position:relative; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                    <button onclick="window.ScholarshipsModule.closeModal()" style="position:absolute; top:20px; right:20px; background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:var(--text-primary); cursor:pointer;">&times;</button>
                    <div id="schModalBody"></div>
                </div>
            </div>
        `;
    }

    function getFilteredScholarships() {
        const data = getScholarships();
        return data.filter(s => {
            const matchSearch = s.title.toLowerCase().includes(currentFilters.search.toLowerCase()) || s.provider.toLowerCase().includes(currentFilters.search.toLowerCase());
            const matchDegree = currentFilters.degreeLevel === 'All' || s.degreeLevel === 'All' || s.degreeLevel.includes(currentFilters.degreeLevel);
            const matchCoverage = currentFilters.coverage === 'All' || s.coverage.includes(currentFilters.coverage);
            return matchSearch && matchDegree && matchCoverage;
        });
    }

    function renderCards() {
        const filtered = getFilteredScholarships();
        if (filtered.length === 0) {
            return `<div style="text-align:center; padding:40px; color:var(--text-secondary); background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg);">No scholarships found matching your filters.</div>`;
        }
        return `
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
                ${filtered.map(s => `
                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px; display:flex; flex-direction:column; gap:12px; transition: transform 0.2s; cursor:pointer;" onclick="window.ScholarshipsModule.openModal('${s.id}')" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent-primary)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-color)';">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary);">${s.country}</span>
                            <span style="font-size:0.75rem; color:var(--status-warning); font-weight:600;">Deadline: ${s.deadline}</span>
                        </div>
                        <h3 style="font-size:1.05rem; color:var(--text-primary); font-family:var(--font-display); line-height:1.4;">${s.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-secondary);"><strong>Coverage:</strong> ${s.coverage}</p>
                        <p style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:12px;"><strong>Provider:</strong> ${s.provider}</p>
                        
                        <button class="btn btn-sm btn-primary" style="margin-top:auto; pointer-events:none; border-radius: var(--radius-md);">View Details</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return {
        render(containerId = 'scholarshipsContainer') {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Initialize structure if not exists
            if (!document.getElementById('schModalOverlay')) {
                document.body.insertAdjacentHTML('beforeend', renderModal());
                // Add click listener to close modal when clicking outside content
                document.getElementById('schModalOverlay').addEventListener('click', function(e) {
                    if (e.target === this) {
                        window.ScholarshipsModule.closeModal();
                    }
                });
            }

            const adminSaveBtn = (window.AdminModule && window.AdminModule.isAdmin()) 
                ? `<button onclick="window.ScholarshipsModule.saveAll()" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:var(--accent-primary); color:white; padding:16px 24px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:none; font-weight:bold; cursor:pointer; font-size:1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">💾 Save All Changes</button>` 
                : '';

            container.innerHTML = `
                ${adminSaveBtn}
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                        <h2 style="font-family:var(--font-display); font-size:1.4rem; color: var(--accent-primary); margin-bottom: 8px;">🎓 National & International Scholarships Hub</h2>
                        <p style="font-size:0.9rem; color:var(--text-secondary);">Verified fully-funded and need-based financial aid opportunities for Pakistani students. Filter and bookmark your favorites!</p>
                    </div>
                    ${renderAddForm()}
                    ${renderFilters()}
                    <div id="schCardsContainer">
                        ${renderCards()}
                    </div>
                </div>
            `;
            
            // Set input values from state
            document.getElementById('schSearch').value = currentFilters.search;
            document.getElementById('schDegree').value = currentFilters.degreeLevel;
            document.getElementById('schCoverage').value = currentFilters.coverage;
        },

        updateFilter(key, value) {
            currentFilters[key] = value;
            document.getElementById('schCardsContainer').innerHTML = renderCards();
        },

        openModal(id) {
            const data = getScholarships();
            const s = data.find(x => x.id === id);
            if (!s) return;
            
            const formatLines = (text) => text.split('\\n').map(line => `<p style="margin-bottom:8px; color:var(--text-secondary); font-size:0.95rem;">${line}</p>`).join('');

            const modalBody = document.getElementById('schModalBody');
            modalBody.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; margin-top:10px;">
                    <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary); font-size:0.9rem; padding:6px 12px;">${s.country}</span>
                    <span style="font-size:0.85rem; color:var(--status-warning); font-weight:600; padding:6px 12px; background:var(--bg-elevated); border-radius:var(--radius-md);">⏳ Deadline: ${s.deadline}</span>
                </div>
                <h2 style="font-family:var(--font-display); font-size:1.6rem; color:var(--accent-primary); margin-bottom:12px; line-height:1.3;">${s.title}</h2>
                
                <div style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:16px; border-radius:8px; margin-bottom:24px;">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                        <div>
                            <span style="color:var(--text-tertiary); font-size:0.8rem; display:block; margin-bottom:4px;">Provider</span>
                            <span style="color:var(--text-primary); font-weight:600; font-size: 0.95rem;">${s.provider}</span>
                        </div>
                        <div>
                            <span style="color:var(--text-tertiary); font-size:0.8rem; display:block; margin-bottom:4px;">Degree Level</span>
                            <span style="color:var(--text-primary); font-weight:600; font-size: 0.95rem;">${s.degreeLevel}</span>
                        </div>
                    </div>
                </div>

                <!-- Detailed Information Sections -->
                <div style="display:flex; flex-direction:column; gap:20px; margin-bottom:32px;">
                    
                    <div>
                        <h3 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:8px; font-family: var(--font-display); display:flex; align-items:center; gap:8px;">
                            <span style="color:var(--accent-primary);">📝</span> Description
                        </h3>
                        <div style="color:var(--text-secondary); line-height:1.6; font-size:0.95rem; margin:0;">${makeEditableText(s.id, 'description', s.description)}</div>
                    </div>
                    
                    <div style="background:rgba(var(--accent-primary-rgb), 0.05); border-left:3px solid var(--accent-primary); padding:16px; border-radius:0 8px 8px 0;">
                        <h3 style="font-size:1.05rem; color:var(--text-primary); margin-bottom:8px; font-family: var(--font-display); display:flex; align-items:center; gap:8px;">
                            <span>💰</span> Financial Benefits & Coverage
                        </h3>
                        ${makeEditableText(s.id, 'benefits', formatLines(s.benefits || s.coverage))}
                    </div>

                    <div>
                        <h3 style="font-size:1.05rem; color:var(--text-primary); margin-bottom:8px; font-family: var(--font-display); display:flex; align-items:center; gap:8px;">
                            <span>✅</span> Eligibility Criteria
                        </h3>
                        ${makeEditableText(s.id, 'eligibilityCriteria', formatLines(s.eligibilityCriteria || 'Check official website for complete criteria.'))}
                    </div>

                    <div>
                        <h3 style="font-size:1.05rem; color:var(--text-primary); margin-bottom:8px; font-family: var(--font-display); display:flex; align-items:center; gap:8px;">
                            <span>🚀</span> Application Process
                        </h3>
                        ${makeEditableText(s.id, 'applicationProcess', formatLines(s.applicationProcess || 'Apply directly via the official portal.'))}
                    </div>

                    <div>
                        <h3 style="font-size:1.05rem; color:var(--text-primary); margin-bottom:8px; font-family: var(--font-display); display:flex; align-items:center; gap:8px;">
                            <span>📂</span> Required Documents
                        </h3>
                        ${makeEditableText(s.id, 'requiredDocuments', formatLines(s.requiredDocuments || 'Standard academic documents required.'))}
                    </div>

                </div>

                <div style="display:flex; gap:12px; flex-wrap:wrap; border-top:1px solid var(--border-color); padding-top:20px;">
                    <a href="${s.website}" target="_blank" class="btn btn-primary" style="flex:1; text-align:center; padding:12px; text-decoration:none; border-radius: 8px;">🌐 Visit Official Website</a>
                    <button class="btn" style="flex:1; background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-color); padding:12px; border-radius: 8px;" onclick="window.ScholarshipsModule.saveScholarship('${s.id}')">⭐ Save Scholarship</button>
                </div>
            `;
            
            document.getElementById('schModalOverlay').style.display = 'flex';
        },

        closeModal() {
            document.getElementById('schModalOverlay').style.display = 'none';
        },

        saveScholarship(id) {
            const data = getScholarships();
            const s = data.find(x => x.id === id);
            if (!s) return;
            
            try {
                const list = JSON.parse(localStorage.getItem('scholarpath_saved_results') || '[]');
                const title = s.title.replace(/'/g, "");
                
                // Add to list if not already saved
                if(!list.some(item => item.id === "sch_" + id)) {
                    const newItem = { id: "sch_" + id, title: title, type: 'scholarship', data: s, savedAt: new Date().toLocaleDateString() };
                    list.unshift(newItem);
                    localStorage.setItem('scholarpath_saved_results', JSON.stringify(list));
                    if (window.showToast) window.showToast('Scholarship Bookmarked to Timeline!', 'success');
                } else {
                    if (window.showToast) window.showToast('Scholarship is already saved.', 'info');
                }
            } catch (err) {
                console.error(err);
                if (window.showToast) window.showToast('Bookmarked scholarship!', 'success');
            }
        },
        updateField(id, field, value) {
            const data = getScholarships();
            const s = data.find(x => x.id === id);
            if (s) {
                // If it's a field we originally formatted with formatLines (which wraps in <p>), we should save it with \n or just save the raw HTML if it's fine.
                // The safest is just saving the HTML directly since this runs client-side.
                s[field] = value;
            }
        },
        addDynamically(aiSch) {
            const data = getScholarships();
            const existingIndex = data.findIndex(s => s.id === aiSch.id);
            if (existingIndex !== -1) {
                data[existingIndex] = { ...data[existingIndex], ...aiSch };
            } else {
                data.push(aiSch);
            }
        },
        searchByQuery(query) {
            const q = query.toLowerCase().trim();
            const words = q.split(/\s+/).filter(w => w.length > 1);
            let best = null;
            let bestScore = 0;
            
            const data = getScholarships();
            data.forEach(s => {
                const name = (s.title || '').toLowerCase().trim();
                const id = (s.id || '').toLowerCase().trim();
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
                    best = s;
                }
            });
            
            return bestScore >= 40 ? { item: best, score: bestScore } : null;
        },
        async saveAll() {
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('scholarships', getScholarships());
            }
        },
        async addScholarship() {
            const title = document.getElementById('addSchTitle')?.value?.trim();
            if (!title) {
                alert('Please enter a Scholarship Title');
                return;
            }

            const country = document.getElementById('addSchCountry')?.value?.trim() || 'Pakistan';
            const provider = document.getElementById('addSchProvider')?.value?.trim() || 'General';
            const degreeLevel = document.getElementById('addSchDegree')?.value || 'Bachelors';
            const coverage = document.getElementById('addSchCoverage')?.value || 'Fully Funded';
            const deadline = document.getElementById('addSchDeadline')?.value?.trim() || 'Ongoing';
            const website = document.getElementById('addSchWebsite')?.value?.trim() || '#';
            const description = document.getElementById('addSchDesc')?.value?.trim() || 'No description provided.';
            const benefits = document.getElementById('addSchBenefits')?.value?.trim() || coverage;
            const eligibilityCriteria = document.getElementById('addSchEligibility')?.value?.trim() || 'Check official website for criteria.';

            const data = getScholarships();
            const id = title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);

            const newSch = {
                id: id,
                title: title,
                country: country,
                provider: provider,
                degreeLevel: degreeLevel,
                coverage: coverage,
                deadline: deadline,
                website: website,
                description: description,
                benefits: benefits,
                eligibilityCriteria: eligibilityCriteria,
                applicationProcess: 'Apply directly via the official website portal.',
                requiredDocuments: 'Standard academic transcripts and identity documents.'
            };

            data.push(newSch);
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('scholarships', data);
            }
            this.render('scholarshipsContainer');
        }
    };
})();
