/**
 * SCHOLARLY AI - Programs Hub Module
 * Clean, animated architecture perfectly aligned with global theme variables.
 */

window.ProgramsModule = (function() {
    let selectedProgramId = null;

    let programs = [];
    // Load data dynamically
    fetch("/data/programs.json?t=" + new Date().getTime())
        .then(r => r.json())
        .then(data => { 
            programs = data; 
            if(document.getElementById("programsContainer")) {
                window.ProgramsModule.render("programsContainer"); 
            }
        })
        .catch(e => console.error("Error loading programs", e));

    function makeEditableText(id, field, value) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<div contenteditable="true" onblur="this.style.background='transparent'; window.ProgramsModule.updateField('${id}', '${field}', this.innerHTML)" style="border:1px dashed var(--accent-primary); padding:4px; border-radius:4px; outline:none; min-height:20px; text-align:justify;" onfocus="this.style.background='rgba(176, 38, 255, 0.05)'">${value}</div>`;
        }
        return value;
    }

    // CSS for animations and clean styling using global CSS variables
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .program-card-clean {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            animation: fadeSlideUp 0.5s ease-out forwards;
            opacity: 0;
            box-shadow: var(--shadow-sm);
        }
        .program-card-clean:hover {
            transform: translateY(-4px);
            border-color: var(--accent-primary);
            box-shadow: var(--shadow-md);
        }
        .stat-card-clean {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 20px;
            transition: border-color 0.2s ease, transform 0.2s ease;
            box-shadow: var(--shadow-sm);
        }
        .stat-card-clean:hover {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        .badge-clean {
            background: var(--bg-elevated);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 4px 12px;
            border-radius: var(--radius-full);
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .course-chip-clean {
            background: var(--bg-elevated);
            border: 1px solid var(--border-color);
            padding: 6px 14px;
            border-radius: var(--radius-full);
            font-size: 0.85rem;
            color: var(--text-secondary);
            transition: all 0.2s;
        }
        .course-chip-clean:hover {
            border-color: var(--accent-primary);
            color: var(--text-primary);
        }
        .hero-banner-clean {
            position: relative;
            padding: 32px 40px;
            border-radius: var(--radius-xl);
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
        }
    `;
    document.head.appendChild(style);

    function renderMasterList() {
        let html = `
            <div style="display:flex; flex-direction:column; gap:32px; animation: fadeSlideUp 0.5s ease-out;">
                <!-- Header Section -->
                <div style="text-align:center; padding: 40px 20px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);">
                    <h2 style="font-family:var(--font-display); font-size:2.5rem; font-weight: 800; line-height:1.2; margin-bottom: 12px; color: var(--text-primary);">
                        Top Degree <span style="color:var(--accent-primary);">Programs</span>
                    </h2>
                    <p style="font-size:1rem; color:var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6;">Explore deep insights, salary trajectories, and elite universities for top degree programs tailored for your success.</p>
                </div>

                <!-- Grid -->
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
        `;

        programs.forEach((p, index) => {
            html += `
                <div class="program-card-clean" onclick="window.ProgramsModule.openDetail('${p.id}')" style="animation-delay: ${index * 0.05}s;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <h3 style="font-size:1.25rem; font-family:var(--font-display); font-weight: 700; margin:0; color: var(--text-primary);">📘 ${p.program_name}</h3>
                        ${p.duration ? `<span class="badge-clean">⏱️ ${p.duration}</span>` : ''}
                    </div>
                    
                    <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
                        ${p.introduction || 'Click to view full details.'}
                    </div>
                    
                    <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:0.8rem; color:var(--text-tertiary); font-weight:600; text-transform:uppercase;">View Details</span>
                        <div style="width:28px; height:28px; border-radius:50%; background:var(--bg-elevated); display:flex; align-items:center; justify-content:center;">
                            <span style="color:var(--accent-primary); font-size:1rem;">→</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        return html;
    }

    function getRenderDetailView(r) {
        const unis = Array.isArray(r.offering_universities) && r.offering_universities.length > 0 
            ? r.offering_universities.map(u => `<span class="badge-clean" style="margin-right:8px; margin-bottom:8px;">🏛️ ${u}</span>`).join('') 
            : '<span style="color:var(--text-tertiary);">Universities not specified</span>';
            
        let html = `
            <div style="animation: fadeSlideUp 0.5s ease-out;">
                <!-- Hero Section -->
                <div class="hero-banner-clean">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
                        <span class="badge-clean">📘 Program Insight</span>
                        ${r.duration ? `<span class="badge-clean">⏱️ ${r.duration}</span>` : ''}
                    </div>
                    <h1 style="font-size:2.4rem; font-family:var(--font-display); font-weight:800; margin:0 0 16px 0; color:var(--text-primary); line-height:1.2;">
                        ${r.program_name || 'Program Details'}
                    </h1>
                    ${r.introduction ? `<div style="font-size:1rem; color:var(--text-secondary); margin:0; line-height:1.7; max-width:800px;">${makeEditableText(r.id, 'introduction', r.introduction)}</div>` : ''}
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-bottom:24px;">
                    <!-- ROI & Career Card -->
                    <div class="stat-card-clean">
                        <h3 style="font-size:1.1rem; color:var(--text-primary); margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
                            📈 Career & Salary
                        </h3>
                        
                        <div style="margin-bottom:16px;">
                            <span style="display:block; font-size:0.8rem; color:var(--text-tertiary); margin-bottom:4px;">Average Starting Salary</span>
                            <strong style="font-size:1.5rem; font-family:var(--font-display); color:var(--status-success);">${r.average_starting_salary || 'Not available'}</strong>
                        </div>

                        <div>
                            <span style="display:block; font-size:0.8rem; color:var(--text-tertiary); margin-bottom:8px;">Career Prospects</span>
                            <div style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">${makeEditableText(r.id, 'career_prospects', r.career_prospects || 'Not available')}</div>
                        </div>
                    </div>

                    <!-- Eligibility Card -->
                    <div class="stat-card-clean">
                        <h3 style="font-size:1.1rem; color:var(--text-primary); margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
                            📋 Eligibility & Prerequisite
                        </h3>
                        <div style="color:var(--text-secondary); font-size:0.95rem; line-height:1.7;">
                            ${makeEditableText(r.id, 'eligibility', r.eligibility || 'Not available')}
                        </div>
                    </div>
                </div>

                <!-- Universities Section -->
                <div class="stat-card-clean" style="margin-bottom:24px; border-left: 4px solid var(--accent-primary);">
                    <h3 style="font-size:1.1rem; color:var(--text-primary); margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
                        🏫 Top Offering Universities
                    </h3>
                    <div style="display:flex; flex-wrap:wrap;">
                        ${unis}
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                    ${r.specializations ? `
                    <div class="stat-card-clean">
                        <h3 style="font-size:1.1rem; color:var(--text-primary); margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
                            🔬 Major Specializations
                        </h3>
                        <p style="color:var(--text-secondary); margin:0; line-height:1.7; font-size:0.95rem;">
                            ${Array.isArray(r.specializations) ? r.specializations.join('<br>• ') : r.specializations}
                        </p>
                    </div>` : ''}

                    ${r.core_courses && r.core_courses.length > 0 ? `
                    <div class="stat-card-clean">
                        <h3 style="font-size:1.1rem; color:var(--text-primary); margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
                            📖 Core Curriculum
                        </h3>
                        <div style="display:flex; flex-wrap:wrap; gap:8px;">
                            ${r.core_courses.map(c => `<span class="course-chip-clean">▹ ${c}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        return html;
    }

    function renderDetail(p) {
        return `
            <div style="display:flex; flex-direction:column; gap:20px; width:100%; max-width:1100px; margin:0 auto;">
                <button onclick="window.ProgramsModule.backToList()" class="btn" style="align-self:flex-start; background:var(--bg-surface); border:1px solid var(--border-color); color:var(--text-primary); display:flex; align-items:center; gap:8px; padding:10px 20px; font-size:0.9rem; border-radius:var(--radius-md); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent-primary)'; this.style.transform='translateX(-4px)';" onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='none';">
                    <span style="font-size:1.2rem;">←</span> Back to Programs
                </button>
                ${getRenderDetailView(p)}
            </div>
        `;
    }

    return {
        getRenderDetailView: getRenderDetailView,
        render: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const adminSaveBtn = (window.AdminModule && window.AdminModule.isAdmin()) 
                ? `<button onclick="window.ProgramsModule.saveAll()" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:var(--accent-primary); color:white; padding:16px 24px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:none; font-weight:bold; cursor:pointer; font-size:1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">💾 Save All Changes</button>` 
                : '';

            if (selectedProgramId) {
                const p = programs.find(x => x.id === selectedProgramId);
                if (p) {
                    container.innerHTML = adminSaveBtn + renderDetail(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
            container.innerHTML = adminSaveBtn + renderMasterList();
        },
        updateField: function(id, field, value) {
            const p = programs.find(x => x.id === id);
            if (p) {
                p[field] = value;
            }
        },
        saveAll: async function() {
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('programs', programs);
            }
        },
        openDetail: function(id) {
            selectedProgramId = id;
            this.render("programsContainer");
        },
        backToList: function() {
            selectedProgramId = null;
            this.render("programsContainer");
        },
        searchByQuery: function(query) {
            const q = query.toLowerCase().trim();
            const words = q.split(/\s+/).filter(w => w.length > 1);
            let best = null;
            let bestScore = 0;
            
            programs.forEach(p => {
                const name = (p.program_name || '').toLowerCase().trim();
                const id = (p.id || '').toLowerCase().trim();
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
                    best = p;
                }
            });
            
            return bestScore >= 40 ? { item: best, score: bestScore } : null;
        },
        addDynamically: function(aiProg) {
            const existingIndex = programs.findIndex(p => p.id === aiProg.id);
            if (existingIndex !== -1) {
                programs[existingIndex] = { ...programs[existingIndex], ...aiProg };
            } else {
                programs.push(aiProg);
            }
        }
    };
})();
