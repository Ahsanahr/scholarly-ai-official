/**
 * SCHOLARLY AI — Entry Test Prep & Past Papers Vault Module
 * Complete database of 20 entry tests (Syllabus, Timings, Tips) and downloadable mock papers.
 */

window.TestPrepModule = (function() {
    const testCategories = ['All', 'NET (NUST)', 'MDCAT (Medical)', 'ECAT (Engineering)', 'FAST Nu-Test', 'SAT / Digital SAT', 'USAT (HEC)', 'NTS NAT', 'AKU', 'IBA', 'PUCIT'];

    // Comprehensive Database of 20 Entry Tests
    let entryTestsDatabase = [];
    fetch("/data/test-prep.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { entryTestsDatabase = data; if(document.getElementById("testPrepContainer")) window.TestPrepModule.render("testPrepContainer"); }).catch(e => console.error(e));
    
    // Top 10 Best Academies in Pakistan
    let academiesDatabase = [];
    fetch("/data/academies.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { academiesDatabase = data; if(document.getElementById("testPrepContainer")) window.TestPrepModule.render("testPrepContainer"); }).catch(e => console.error(e));

    // 5,000 MCQs Practice Portal Database (7 Subjects)
    let mcqSubjectsDatabase = [];
    let activeQuizState = null;
    let timerInterval = null;

    function loadMcqSubjects() {
        fetch("/data/mcqs/index.json?t=" + new Date().getTime())
            .then(r => r.json())
            .then(data => {
                mcqSubjectsDatabase = data;
                if (document.getElementById("tpPracticeSection")) {
                    renderPracticeHub();
                }
            })
            .catch(e => console.error("Error loading MCQ subjects index:", e));
    }
    loadMcqSubjects();


    function makeEditableText(id, field, value, type='academy') {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<div contenteditable="true" onblur="this.style.background='transparent'; window.TestPrepModule.updateField('${id}', '${field}', this.innerHTML, '${type}')" style="border:1px dashed var(--accent-primary); padding:4px; border-radius:4px; outline:none; min-height:20px; text-align:justify;" onfocus="this.style.background='rgba(176, 38, 255, 0.05)'">${value}</div>`;
        }
        return value;
    }

    function makeEditableCode(c) {
        const isAdmin = window.AdminModule && window.AdminModule.isAdmin();
        if (isAdmin) {
            return `<span contenteditable="true" onblur="window.TestPrepModule.updateCode('${c.id}', this.innerText)" style="border:1px dashed var(--accent-primary); padding:2px 8px; border-radius:4px; outline:none; color:var(--accent-primary);" onfocus="this.style.background='rgba(176, 38, 255, 0.1)'" onblur="this.style.background='transparent'; window.TestPrepModule.updateCode('${c.id}', this.innerText)">${c.discountCode || 'Add Coupon Code'}</span>`;
        }
        
        if (!c.discountCode) return '';
        
        const isProOrAbove = window.ScholarAuth && (window.ScholarAuth.isOwner() || window.ScholarAuth.getUserPlan() === 'pro' || window.ScholarAuth.getUserPlan() === 'premium' || window.ScholarAuth.getUserPlan() === 'premier');
        
        if (isProOrAbove) {
            return `<strong style="color:var(--accent-primary); background:var(--accent-subtle); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Use Code: ${c.discountCode}</strong>`;
        } else {
            return `<span style="color:var(--text-tertiary); background:var(--bg-elevated); padding:4px 8px; border-radius:4px; font-size:0.82rem; cursor:pointer;" onclick="if(window.switchView) switchView('pricing');">🔒 Upgrade to Pro to view Coupon Code</span>`;
        }
    }

    // Vault Data linked to real mock files
    const pastPapersData = [
        { title: 'NUST NET Mock Paper (2025)', test: 'NET (NUST)', subject: 'Complete', size: '1.2 MB', type: 'PDF', file: 'papers/net_mock_paper.pdf' },
        { title: 'National MDCAT Past Paper', test: 'MDCAT (Medical)', subject: 'Complete', size: '2.1 MB', type: 'PDF', file: 'papers/mdcat_mock_paper.pdf' },
        { title: 'NUMS Biology MCQs Bank', test: 'NUMS', subject: 'Biology', size: '1.8 MB', type: 'PDF', file: 'papers/nums_mock_paper.pdf' },
        { title: 'UET ECAT Physics 10 Yrs Solved', test: 'ECAT (Engineering)', subject: 'Physics', size: '3.4 MB', type: 'PDF', file: 'papers/ecat_mock_paper.pdf' },
        { title: 'FAST NU Adv Math Formulas', test: 'FAST Nu-Test', subject: 'Adv Math', size: '1.1 MB', type: 'PDF', file: 'papers/fast_mock_paper.pdf' },
        { title: 'LCAT Essay Prompts & Samples', test: 'LCAT', subject: 'English', size: '0.9 MB', type: 'PDF', file: 'papers/lcat_mock_paper.pdf' },
        { title: 'HEC USAT Quantitative Guide', test: 'USAT (HEC)', subject: 'Math', size: '2.5 MB', type: 'PDF', file: 'papers/usat_mock_paper.pdf' },
        { title: 'NTS NAT Analytical Reasoning Tricks', test: 'NTS NAT', subject: 'Logic', size: '1.7 MB', type: 'PDF', file: 'papers/nat_mock_paper.pdf' },
        { title: 'AKU Science Reasoning Practice', test: 'AKU', subject: 'Science', size: '2.8 MB', type: 'PDF', file: 'papers/aku_mock_paper.pdf' },
        { title: 'IBA Karachi English Vocab List', test: 'IBA', subject: 'English', size: '1.4 MB', type: 'PDF', file: 'papers/iba_mock_paper.pdf' },
        { title: 'PUCIT General Math Notes', test: 'PUCIT', subject: 'Math', size: '1.2 MB', type: 'PDF', file: 'papers/pucit_mock_paper.pdf' },
        { title: 'GIKI Physics Hard Numericals', test: 'GIKI', subject: 'Physics', size: '2.2 MB', type: 'PDF', file: 'papers/giki_mock_paper.pdf' },
        { title: 'PIEAS Chemistry Conceptual MCQs', test: 'PIEAS', subject: 'Chemistry', size: '1.9 MB', type: 'PDF', file: 'papers/pieas_mock_paper.pdf' },
        { title: 'ETEA KPK Board Specific Biology', test: 'ETEA', subject: 'Biology', size: '3.1 MB', type: 'PDF', file: 'papers/etea_mock_paper.pdf' },
        { title: 'NED Engineering Complete Mock', test: 'NED', subject: 'Complete', size: '4.5 MB', type: 'PDF', file: 'papers/ned_mock_paper.pdf' },
        { title: 'MUET Past 5 Years Solved', test: 'MUET', subject: 'Complete', size: '3.8 MB', type: 'PDF', file: 'papers/muet_mock_paper.pdf' },
        { title: 'COMSATS NAT-ICS Practice', test: 'COMSATS', subject: 'Complete', size: '2.4 MB', type: 'PDF', file: 'papers/comsats_mock_paper.pdf' },
        { title: 'Dow Medical Specific MCQs', test: 'Dow', subject: 'Medical', size: '1.6 MB', type: 'PDF', file: 'papers/dow_mock_paper.pdf' },
        { title: 'Sindh MCAT (JSMU) Mock Test', test: 'Sindh MCAT', subject: 'Complete', size: '2.7 MB', type: 'PDF', file: 'papers/sindhmcat_mock_paper.pdf' },
        { title: 'Digital SAT Bluebook Explanations', test: 'SAT', subject: 'English/Math', size: '5.1 MB', type: 'PDF', file: 'papers/sat_mock_paper.pdf' }
    ];

    function injectStyles() {
        if (!document.getElementById('tpStyles')) {
            const style = document.createElement('style');
            style.id = 'tpStyles';
            style.textContent = `
                .tp-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .tp-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-primary);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                /* Modal Styles */
                .tp-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.2s;
                }
                .tp-modal-overlay.active {
                    opacity: 1; pointer-events: all;
                }
                .tp-modal-content {
                    background: var(--bg-surface); border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg); padding: 32px; width: 90%; max-width: 600px;
                    transform: scale(0.95); transition: transform 0.2s;
                    max-height: 85vh; overflow-y: auto;
                }
                .tp-modal-overlay.active .tp-modal-content {
                    transform: scale(1);
                }
                .tp-modal-section {
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid var(--border-subtle);
                }
                .tp-modal-section h4 {
                    font-size: 0.95rem; color: var(--accent-primary); margin-bottom: 8px; font-weight: 600;
                    display: flex; align-items: center; gap: 8px;
                }
                .tp-modal-section p {
                    font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function renderAddForm() {
        if (!(window.AdminModule && window.AdminModule.isAdmin())) return '';
        
        return `
            <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-xl); border:1px solid var(--accent-primary); margin-bottom:24px; box-shadow:0 4px 20px rgba(176,38,255,0.1);">
                <h3 style="margin-bottom:16px; color:var(--accent-primary); font-family:var(--font-display); font-size:1.3rem;">➕ Add New Entry Test / Academy (Admin)</h3>
                
                <div style="margin-bottom:16px;">
                    <label style="font-weight:600; color:var(--text-primary); margin-right:12px;">Select What To Add:</label>
                    <select id="tpAddType" onchange="const isAcad = this.value === 'academy'; document.getElementById('tpTestFields').style.display = isAcad ? 'none' : 'grid'; document.getElementById('tpAcadFields').style.display = isAcad ? 'grid' : 'none';" style="padding:8px 16px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-weight:bold;">
                        <option value="test">Entry Test Guide</option>
                        <option value="academy">Coaching Center / Academy</option>
                    </select>
                </div>

                <!-- Fields for Entry Test Guide -->
                <div id="tpTestFields" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:16px;">
                    <input type="text" id="addTestName" placeholder="Test Name (e.g. GIKI Test) *" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addTestCategory" placeholder="Category (e.g. Engineering)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <textarea id="addTestSyllabus" placeholder="Official Syllabus & Weightage..." style="grid-column: 1 / -1; height:60px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addTestTiming" placeholder="Timings & Structure..." style="grid-column: 1 / -1; height:60px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                    <textarea id="addTestTips" placeholder="Preparation Tips & Tricks..." style="grid-column: 1 / -1; height:60px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                </div>

                <!-- Fields for Academy -->
                <div id="tpAcadFields" style="display:none; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:16px;">
                    <input type="text" id="addAcadName" placeholder="Academy Name *" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addAcadSpecialty" placeholder="Specialty (e.g. MDCAT & ECAT Prep)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addAcadRating" placeholder="Rating (e.g. 4.9 ★)" value="4.9 ★" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addAcadCode" placeholder="Discount Coupon Code" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <input type="text" id="addAcadLink" placeholder="Website URL (https://...)" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary);">
                    <textarea id="addAcadDesc" placeholder="Academy Description..." style="grid-column: 1 / -1; height:60px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:inherit;"></textarea>
                </div>

                <button class="btn btn-primary" onclick="window.TestPrepModule.addEntryTestOrAcademy()" style="padding:12px 24px; font-weight:bold; border-radius:8px;">Save New Entry</button>
            </div>
        `;
    }

    return {
        render(containerId = 'testPrepContainer') {
            injectStyles();
            const container = document.getElementById(containerId);
            if (!container) return;

            const adminSaveBtn = (window.AdminModule && window.AdminModule.isAdmin()) 
                ? `<button onclick="window.TestPrepModule.saveAll()" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:var(--accent-primary); color:white; padding:16px 24px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.3); border:none; font-weight:bold; cursor:pointer; font-size:1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">💾 Save All Changes</button>` 
                : '';

            container.innerHTML = `
                ${adminSaveBtn}
                <div class="test-prep-wrapper" style="display:flex; flex-direction:column; gap:24px;">
                    <!-- Top Banner / Tabs -->
                    <div id="tpTopBanner" style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                            <div>
                                <h2 style="font-family:var(--font-display); font-size:1.5rem; color:var(--text-primary);">🎯 Master Entry Test Hub</h2>
                                <p style="color:var(--text-secondary); font-size:0.9rem;">The ultimate database of 20 university entry tests and downloadable past papers.</p>
                            </div>
                            <div style="display:flex; gap:12px; flex-wrap:wrap;">
                                <button class="btn btn-primary" id="btn-guides" onclick="TestPrepModule.switchTab('guides')">📖 Test Master Guides</button>
                                <button class="btn btn-secondary" id="btn-academies" onclick="TestPrepModule.switchTab('academies')">🏫 Best Academies</button>
                                <button class="btn btn-secondary" id="btn-practice" onclick="TestPrepModule.switchTab('practice')">💻 Practice Portals</button>
                                <button class="btn btn-secondary" id="btn-vault" onclick="TestPrepModule.switchTab('vault')">📁 Past Papers Vault</button>
                            </div>
                        </div>
                    </div>

                    ${renderAddForm()}

                    <!-- Test Master Guides Section -->
                    <div id="tpGuidesSection" class="tp-tab-content" style="display:block;">
                        <h3 style="font-family:var(--font-display); margin-bottom:16px;">📖 Comprehensive Syllabus & Test Structures</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                            ${entryTestsDatabase.map(test => `
                                <div class="tp-card" onclick="TestPrepModule.openTestModal('${test.id}')">
                                    <div style="display:flex; justify-content:space-between; align-items:start;">
                                        <h4 style="color:var(--text-primary); font-size:1.1rem; font-family:var(--font-display);">${test.name}</h4>
                                    </div>
                                    <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary); font-size:0.75rem; align-self:flex-start;">${test.category}</span>
                                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:auto;">Click to view syllabus, timing & tips →</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Academies Section -->
                    <div id="tpAcademiesSection" class="tp-tab-content" style="display:none;">
                        <h3 style="font-family:var(--font-display); margin-bottom:16px;">🏫 Top 10 Entry Test Academies</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap:20px; margin-bottom:32px;">
                            ${academiesDatabase.map(acc => `
                                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; display:flex; flex-direction:column; gap:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                                    <div style="display:flex; justify-content:space-between; align-items:start;">
                                        <h4 style="color:var(--text-primary); font-size:1.1rem; font-family:var(--font-display);">${acc.name}</h4>
                                        <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary); font-size:0.75rem;">${acc.specialty}</span>
                                    </div>
                                    <span style="color:var(--status-warning); font-size:0.9rem; font-weight:bold;">${acc.rating}</span>
                                    <div style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-top:8px;">${makeEditableText(acc.id, 'description', acc.description, 'academy')}</div>
                                    <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
                                        <div>${makeEditableCode(acc)}</div>
                                        <a href="${acc.link}" target="_blank" class="btn btn-sm btn-primary" style="text-decoration:none;">Visit Website ↗</a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- FREE PRACTICE RESOURCES (MOVED TO ACADEMIES SECTION) -->
                        <div style="padding-top:24px; border-top:1px solid var(--border-color);">
                            <h4 style="font-family:var(--font-display); margin-bottom:14px; color:var(--text-primary); font-size:1.05rem;">🌐 Free Online Practice Portals</h4>
                            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:16px;">
                                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; text-align:center;">
                                    <h4 style="color:var(--text-primary); font-size:1.05rem; margin-bottom:8px;">PakMcqs Practice</h4>
                                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:14px;">General knowledge & subject past MCQs.</p>
                                    <a href="https://pakmcqs.com" target="_blank" class="btn btn-sm btn-secondary" style="text-decoration:none;">Visit PakMcqs ↗</a>
                                </div>
                                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; text-align:center;">
                                    <h4 style="color:var(--text-primary); font-size:1.05rem; margin-bottom:8px;">Khan Academy</h4>
                                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:14px;">Digital SAT practice & STEM fundamentals.</p>
                                    <a href="https://khanacademy.org" target="_blank" class="btn btn-sm btn-secondary" style="text-decoration:none;">Visit Khan Academy ↗</a>
                                </div>
                                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; text-align:center;">
                                    <h4 style="color:var(--text-primary); font-size:1.05rem; margin-bottom:8px;">Gotest.pk</h4>
                                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:14px;">Mock quizzes for NAT, ECAT & MDCAT.</p>
                                    <a href="https://gotest.pk" target="_blank" class="btn btn-sm btn-secondary" style="text-decoration:none;">Visit Gotest.pk ↗</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Practice & MCQs Section -->
                    <div id="tpPracticeSection" class="tp-tab-content" style="display:none;">
                        
                        <!-- STEP 1: SUBJECT SELECTION -->
                        <div id="practiceStepSubjects" style="display:block;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px; background:var(--bg-surface); padding:20px 24px; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                                <div>
                                    <h3 style="font-family:var(--font-display); font-size:1.4rem; color:var(--text-primary); margin:0 0 4px 0;">Subject Selection</h3>
                                    <p style="color:var(--text-secondary); font-size:0.9rem; margin:0;">Select a subject to begin chapter-wise MCQs practice & mock tests.</p>
                                </div>
                                <div style="display:flex; gap:10px; align-items:center;">
                                    <button class="btn btn-sm btn-primary" onclick="TestPrepModule.openMockSetupModal()" style="background:linear-gradient(135deg, #B026FF, #7C4DFF); border:none; font-weight:700;">⏱️ Custom Mock Test</button>
                                    ${ (window.AdminModule && window.AdminModule.isAdmin()) ? `<button class="btn btn-sm btn-secondary" onclick="TestPrepModule.openMcqImporterModal()" style="border:1px dashed var(--accent-primary);">📥 Import PDF/JSON</button>` : '' }
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:20px; margin-bottom:32px;" id="mcqSubjectGrid">
                                ${(mcqSubjectsDatabase && mcqSubjectsDatabase.length > 0) ? mcqSubjectsDatabase.map(sub => `
                                    <div onclick="TestPrepModule.selectSubject('${sub.id}')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:28px 20px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; cursor:pointer; transition:transform 0.2s, border-color 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='${sub.color}'" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-color)'">
                                        <div style="width:70px; height:70px; border-radius:20px; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; font-size:2.5rem; border:1px solid rgba(255,255,255,0.08);">
                                            ${sub.icon}
                                        </div>
                                        <div>
                                            <h4 style="margin:0 0 6px 0; color:var(--text-primary); font-size:1.15rem; font-family:var(--font-display); font-weight:700; letter-spacing:0.5px;">${sub.title}</h4>
                                            <span style="font-size:0.8rem; color:${sub.color}; font-weight:600;">${(sub.topics || []).length} Topics • Practice MCQs</span>
                                        </div>
                                    </div>
                                `).join('') : '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-secondary);">Loading subjects...</div>'}
                            </div>
                        </div>

                        <!-- STEP 2: TOPICS LIST -->
                        <div id="practiceStepTopics" style="display:none;">
                            <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
                                <button class="btn btn-sm btn-secondary" onclick="TestPrepModule.backToSubjects()" style="font-size:1.2rem; padding:6px 14px;">←</button>
                                <h3 id="topicSubjectHeaderTitle" style="font-family:var(--font-display); font-size:1.5rem; color:var(--text-primary); margin:0;">Physics</h3>
                            </div>

                            <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:32px;" id="topicsListContainer">
                                <!-- Dynamic Topic Items rendered by selectSubject() -->
                            </div>
                        </div>

                        <!-- STEP 3: MCQS PRACTICE SCREEN -->
                        <div id="practiceStepMcqs" style="display:none;">
                            <!-- Header Bar -->
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px;">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <button class="btn btn-sm btn-secondary" onclick="TestPrepModule.backToTopics()" style="font-size:1.2rem; padding:4px 12px;">←</button>
                                    <h3 style="margin:0; font-family:var(--font-display); font-size:1.3rem; color:var(--text-primary);">Practice</h3>
                                </div>
                                <button class="btn btn-sm btn-secondary" onclick="TestPrepModule.openFilterModal()" style="font-size:0.9rem; padding:6px 12px;" title="Filter MCQs">🎛️ Filter</button>
                            </div>

                            <!-- Breadcrumb & Question Combined Card -->
                            <div id="mcqQuestionContainer" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-xl); overflow:hidden; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                                <!-- Top Bar -->
                                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; background:var(--bg-elevated); padding:12px 16px; border-bottom:1px solid var(--border-color);">
                                    <div>
                                        <span id="mcqBreadcrumb" style="font-size:0.75rem; color:var(--text-secondary); display:block; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Physics - Current Electricity</span>
                                        <span id="mcqAttemptedCounter" style="font-size:0.75rem; color:var(--text-tertiary); font-weight:500;">Attempted: 0</span>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span id="mcqProgressPill" class="badge" style="background:var(--bg-surface); border:1px solid var(--border-color); color:var(--accent-primary); font-size:0.8rem; padding:4px 10px; font-weight:700;">1/85</span>
                                        <button class="btn btn-sm btn-secondary" onclick="TestPrepModule.resetTopicProgress()" title="Reset Topic Progress" style="padding:4px 8px; font-size:0.8rem;">🔄</button>
                                        <button class="btn btn-sm btn-primary" onclick="TestPrepModule.toggleNotepad()" style="background:#4F46E5; border:none; font-weight:700; padding:4px 12px; font-size:0.8rem;">📝 PAD</button>
                                    </div>
                                </div>
                                
                                <!-- Question Card -->
                                <div id="mcqQuestionCard" class="mcq-q-card" style="padding:16px;">
                                    <!-- Question & Options rendered by renderMcqScreen() -->
                                </div>
                            </div>

                            <!-- Footer Navigation -->
                            <div class="mcq-footer-nav" style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                                <button class="btn btn-secondary" onclick="TestPrepModule.backToTopics()" style="color:#ef4444; border-color:rgba(239, 68, 68, 0.3); font-weight:600;">📊 Save & Exit</button>
                                <div style="display:flex; gap:12px;">
                                    <button class="btn btn-secondary" onclick="TestPrepModule.prevMcq()" id="btnPrevMcq">← Prev</button>
                                    <button class="btn btn-primary" onclick="TestPrepModule.nextMcq()" id="btnNextMcq" style="background:var(--accent-primary); border:none; width:44px; height:44px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:bold;">❯</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Past Papers Vault Section -->
                    <div id="tpVaultSection" class="tp-tab-content" style="display:none;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                            <h3 style="font-family:var(--font-display);">📁 Downloadable Papers Repository</h3>
                            <input type="text" id="vaultSearch" placeholder="Search papers, subjects..." class="form-input" style="max-width:300px;" oninput="TestPrepModule.filterVault()">
                        </div>

                        <!-- Category Filter Chips -->
                        <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:16px;">
                            ${testCategories.map((cat, idx) => `
                                <button class="btn btn-sm ${idx === 0 ? 'btn-primary' : 'btn-secondary'}" onclick="TestPrepModule.filterCategory('${cat}', this)">${cat}</button>
                            `).join('')}
                        </div>

                        <!-- Papers List -->
                        <div id="vaultListContainer" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
                            ${this.renderPapers(pastPapersData)}
                        </div>
                    </div>
                </div>

                <!-- TEST DETAIL MODAL -->
                <div class="tp-modal-overlay" id="testDetailModal">
                    <div class="tp-modal-content">
                        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:16px;">
                            <div>
                                <span id="modalTestCategory" class="badge" style="background:var(--accent-subtle); color:var(--accent-primary); font-size:0.75rem; margin-bottom:8px; display:inline-block;"></span>
                                <h2 id="modalTestName" style="font-family:var(--font-display); font-size:1.5rem; color:var(--text-primary);"></h2>
                            </div>
                            <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.closeTestModal()">×</button>
                        </div>
                        
                        <div class="tp-modal-section">
                            <h4>📚 Official Syllabus & Weightage</h4>
                            <div id="modalTestSyllabus"></div>
                        </div>
                        
                        <div class="tp-modal-section">
                            <h4>⏱️ Timings & Structure</h4>
                            <div id="modalTestTiming"></div>
                        </div>
                        
                        <div class="tp-modal-section">
                            <h4>💡 Preparation Tips & Tricks</h4>
                            <div id="modalTestTips"></div>
                        </div>

                        <div style="margin-top:32px; text-align:right;">
                            <button class="btn btn-primary" onclick="TestPrepModule.closeTestModal()">Close Guide</button>
                        </div>
                    </div>
                </div>

                <!-- INTERACTIVE MCQ QUIZ MODAL -->
                <div class="tp-modal-overlay" id="mcqQuizModal" style="align-items:flex-start; padding-top:40px;">
                    <div class="tp-modal-content" style="max-width:850px; width:95%; border-radius:var(--radius-xl); box-shadow:0 20px 50px rgba(0,0,0,0.3);" id="mcqQuizContent">
                        <!-- Dynamic Content Rendered by renderActiveQuestion() -->
                    </div>
                </div>

                <!-- MCQ RESULTS SUMMARY MODAL -->
                <div class="tp-modal-overlay" id="mcqResultsModal" style="align-items:center;">
                    <div class="tp-modal-content" style="max-width:700px; width:95%; border-radius:var(--radius-xl);" id="mcqResultsContent">
                        <!-- Dynamic Content Rendered by renderQuizResults() -->
                    </div>
                </div>

                <!-- ADMIN MCQ IMPORTER MODAL -->
                <div class="tp-modal-overlay" id="mcqImporterModal">
                    <div class="tp-modal-content" style="max-width:650px; width:95%;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                            <h3 style="margin:0; font-family:var(--font-display); color:var(--text-primary);">📥 Import Batch MCQs (Admin)</h3>
                            <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.closeMcqImporterModal()">×</button>
                        </div>
                        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:16px;">
                            Select subject and paste raw MCQ text or JSON array.
                        </p>

                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary);">Target Subject:</label>
                            <select id="importSubjectSelect" style="padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-weight:bold;">
                                <option value="english">English</option>
                                <option value="math">Math</option>
                                <option value="iq">IQ & Intelligence</option>
                                <option value="physics">Physics</option>
                                <option value="biology">Biology</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="computer">Computer Science</option>
                            </select>

                            <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary);">MCQ Content (Text or JSON):</label>
                            <textarea id="importMcqText" placeholder="Paste 500 MCQs text or JSON array here...&#10;&#10;Format Example:&#10;1. What is the unit of force?&#10;A) Joule B) Newton C) Watt D) Pascal&#10;Ans: B&#10;Explanation: Force is measured in Newtons." style="width:100%; height:180px; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-family:monospace; font-size:0.85rem;"></textarea>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:12px;">
                            <button class="btn btn-secondary" onclick="TestPrepModule.closeMcqImporterModal()">Cancel</button>
                            <button class="btn btn-primary" onclick="TestPrepModule.processMcqImport()">Parse & Append MCQs</button>
                        </div>
                    </div>
                </div>

                <!-- FILTER MODAL (MATCHING IMAGE 4) -->
                <div class="tp-modal-overlay" id="mcqFilterModal">
                    <div class="tp-modal-content" style="max-width:500px; width:95%; border-radius:var(--radius-xl);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                            <h3 style="margin:0; font-family:var(--font-display); color:var(--text-primary);">Filters</h3>
                            <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.closeFilterModal()">×</button>
                        </div>

                        <!-- Status Filter Chips -->
                        <div style="margin-bottom:20px;">
                            <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:8px;">Question Status:</label>
                            <div style="display:flex; gap:8px;">
                                <button class="btn btn-sm filter-status-chip btn-primary" data-status="ALL" onclick="TestPrepModule.setStatusFilter('ALL', this)">All</button>
                                <button class="btn btn-sm filter-status-chip btn-secondary" data-status="ATTEMPTED" onclick="TestPrepModule.setStatusFilter('ATTEMPTED', this)">Attempted</button>
                                <button class="btn btn-sm filter-status-chip btn-secondary" data-status="UNATTEMPTED" onclick="TestPrepModule.setStatusFilter('UNATTEMPTED', this)">Unattempted</button>
                            </div>
                        </div>

                        <!-- Dropdowns -->
                        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:8px;">Entry Test Filter (Multi-Select):</label>
                                <div style="display:flex; flex-wrap:wrap; gap:8px;" id="entryTestChipsContainer">
                                    <button class="btn btn-sm filter-test-chip btn-primary" data-test="ALL" onclick="TestPrepModule.toggleEntryTestFilter('ALL', this)">All Tests</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="SAT" onclick="TestPrepModule.toggleEntryTestFilter('SAT', this)">SAT</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="USAT" onclick="TestPrepModule.toggleEntryTestFilter('USAT', this)">USAT</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="ECAT" onclick="TestPrepModule.toggleEntryTestFilter('ECAT', this)">ECAT</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="NET" onclick="TestPrepModule.toggleEntryTestFilter('NET', this)">NET</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="MDCAT" onclick="TestPrepModule.toggleEntryTestFilter('MDCAT', this)">MDCAT</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="FAST" onclick="TestPrepModule.toggleEntryTestFilter('FAST', this)">FAST</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="PIEAS" onclick="TestPrepModule.toggleEntryTestFilter('PIEAS', this)">PIEAS</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="GIKI" onclick="TestPrepModule.toggleEntryTestFilter('GIKI', this)">GIKI</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="LAT" onclick="TestPrepModule.toggleEntryTestFilter('LAT', this)">LAT</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="NTC" onclick="TestPrepModule.toggleEntryTestFilter('NTC', this)">NTC</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="IBA" onclick="TestPrepModule.toggleEntryTestFilter('IBA', this)">IBA</button>
                                    <button class="btn btn-sm filter-test-chip btn-secondary" data-test="LCAT" onclick="TestPrepModule.toggleEntryTestFilter('LCAT', this)">LCAT</button>
                                </div>
                            </div>

                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Question Difficulty:</label>
                                <select id="filterDifficulty" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem;">
                                    <option value="ALL">All Difficulties</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Past Paper Only:</label>
                                <select id="filterPastPaper" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem;">
                                    <option value="ALL">All Questions</option>
                                    <option value="YES">Past Paper Questions Only</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; gap:12px;">
                            <button class="btn btn-secondary" style="flex:1;" onclick="TestPrepModule.closeFilterModal()">Cancel</button>
                            <button class="btn btn-primary" style="flex:1; background:var(--accent-primary); font-weight:bold;" onclick="TestPrepModule.applyFilters()">Apply Filters</button>
                        </div>
                    </div>
                </div>

                <!-- INTERACTIVE DRAWING NOTEPAD OVERLAY -->
                <div class="tp-modal-overlay" id="notepadOverlayModal" style="z-index:10005;">
                    <div class="tp-modal-content" style="max-width:800px; width:95%; height:80vh; display:flex; flex-direction:column; padding:20px; border-radius:var(--radius-xl);">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:12px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <h3 style="margin:0; font-family:var(--font-display); color:var(--text-primary);">📝 Equation Scratchpad / Notepad</h3>
                                <span style="font-size:0.8rem; color:var(--text-secondary);">Draw or solve math/physics calculations</span>
                            </div>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <button class="btn btn-sm btn-secondary" onclick="TestPrepModule.clearNotepadCanvas()">🧹 Clear</button>
                                <button style="background:none; border:none; font-size:1.6rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.toggleNotepad()">×</button>
                            </div>
                        </div>

                        <div style="flex:1; background:#1e1e2e; border:1px solid var(--border-color); border-radius:12px; position:relative; overflow:hidden; cursor:crosshair;" id="notepadCanvasContainer">
                            <canvas id="notepadCanvas" style="width:100%; height:100%; display:block;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- MOCK TEST CUSTOM SETUP MODAL -->
                <div class="tp-modal-overlay" id="mockSetupModal">
                    <div class="tp-modal-content" style="max-width:550px; width:95%; border-radius:var(--radius-xl);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                            <h3 style="margin:0; font-family:var(--font-display); color:var(--text-primary);">⏱️ Custom Mock Test Setup</h3>
                            <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.closeMockSetupModal()">×</button>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Select Subject:</label>
                                <select id="mockSubjectSelect" onchange="TestPrepModule.populateMockTopics(this.value)" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem; font-weight:bold;">
                                    ${(mcqSubjectsDatabase || []).map(s => `<option value="${s.id}">${s.title}</option>`).join('')}
                                </select>
                            </div>

                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Select Topics:</label>
                                <select id="mockTopicSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem;">
                                    <option value="ALL">All Topics (Full Subject Mock)</option>
                                </select>
                            </div>

                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Number of MCQs:</label>
                                <div style="display:flex; gap:8px;">
                                    <button class="btn btn-sm mock-mcq-cnt-btn btn-secondary" onclick="TestPrepModule.setMockMcqCount(10, this)">10</button>
                                    <button class="btn btn-sm mock-mcq-cnt-btn btn-primary" onclick="TestPrepModule.setMockMcqCount(20, this)">20</button>
                                    <button class="btn btn-sm mock-mcq-cnt-btn btn-secondary" onclick="TestPrepModule.setMockMcqCount(30, this)">30</button>
                                    <button class="btn btn-sm mock-mcq-cnt-btn btn-secondary" onclick="TestPrepModule.setMockMcqCount(50, this)">50</button>
                                    <button class="btn btn-sm mock-mcq-cnt-btn btn-secondary" onclick="TestPrepModule.setMockMcqCount(100, this)">100</button>
                                </div>
                            </div>

                            <div>
                                <label style="font-weight:bold; font-size:0.85rem; color:var(--text-primary); display:block; margin-bottom:6px;">Time Limit:</label>
                                <select id="mockTimerSelect" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem;">
                                    <option value="10">10 Minutes</option>
                                    <option value="20" selected>20 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="60">60 Minutes</option>
                                    <option value="90">90 Minutes</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; gap:12px;">
                            <button class="btn btn-secondary" style="flex:1;" onclick="TestPrepModule.closeMockSetupModal()">Cancel</button>
                            <button class="btn btn-primary" style="flex:1; background:linear-gradient(135deg, #B026FF, #7C4DFF); font-weight:bold; border:none;" onclick="TestPrepModule.launchCustomMock()">Launch Mock Exam 🚀</button>
                        </div>
                    </div>
                </div>
            `;
        },

        updateField(id, field, value, type) {
            if (type === 'academy') {
                const acc = academiesDatabase.find(x => x.id === id);
                if (acc) acc[field] = value;
            } else if (type === 'test') {
                const test = entryTestsDatabase.find(x => x.id === id);
                if (test) test[field] = value;
            }
        },
        async saveAll() {
            if (window.AdminModule) {
                await window.AdminModule.saveJsonData('academies', academiesDatabase, true);
                await window.AdminModule.saveJsonData('test-prep', entryTestsDatabase);
            }
        },
        async updateCode(id, code) {
            code = code.trim();
            if (code === 'Add Coupon Code') code = '';
            
            const acc = academiesDatabase.find(x => x.id === id);
            if (acc) {
                acc.discountCode = code;
                if (window.AdminModule) {
                    await window.AdminModule.saveJsonData('academies', academiesDatabase, true);
                }
            }
        },

        switchTab(tab) {
            const tabs = ['guides', 'academies', 'practice', 'vault'];
            
            const topBanner = document.getElementById('tpTopBanner');
            if (topBanner) {
                // On mobile, if we are inside a sub-feature, hide the top banner.
                // Wait, if window.innerWidth <= 768, just hide it because we are using deep linking!
                if (window.innerWidth <= 768) {
                    topBanner.style.display = 'none';
                } else {
                    topBanner.style.display = 'block';
                }
            }
            
            tabs.forEach(t => {
                const section = document.getElementById(t === 'guides' ? 'tpGuidesSection' : 
                                                        t === 'academies' ? 'tpAcademiesSection' : 
                                                        t === 'practice' ? 'tpPracticeSection' : 'tpVaultSection');
                const btn = document.getElementById(`btn-${t}`);
                
                if (section && btn) {
                    if (t === tab) {
                        section.style.display = 'block';
                        btn.classList.replace('btn-secondary', 'btn-primary');
                    } else {
                        section.style.display = 'none';
                        btn.classList.replace('btn-primary', 'btn-secondary');
                    }
                }
            });
        },

        openTestModal(id) {
            const test = entryTestsDatabase.find(t => t.id === id);
            if (!test) return;

            document.getElementById('modalTestName').textContent = test.name;
            document.getElementById('modalTestCategory').textContent = test.category;
            document.getElementById('modalTestSyllabus').innerHTML = makeEditableText(test.id, 'syllabus', test.syllabus, 'test');
            document.getElementById('modalTestTiming').innerHTML = makeEditableText(test.id, 'timing', test.timing, 'test');
            document.getElementById('modalTestTips').innerHTML = makeEditableText(test.id, 'tips', test.tips, 'test');

            document.getElementById('testDetailModal')?.classList.add('active');
        },

        closeTestModal() {
            document.getElementById('testDetailModal')?.classList.remove('active');
        },

        renderPapers(list) {
            return list.map(item => `
                <div class="past-paper-card" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:12px;">
                    <div class="past-paper-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                        <span class="badge" style="background:rgba(124, 58, 237, 0.15); color:var(--accent-primary);">${item.test}</span>
                        <span style="font-size:0.75rem; color:var(--text-tertiary);">${item.size} • ${item.type}</span>
                    </div>
                    <h4 class="past-paper-title" style="font-size:0.95rem; color:var(--text-primary); line-height:1.4;">${item.title}</h4>
                    <div class="past-paper-actions" style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; flex-wrap:wrap; gap:8px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">${item.subject}</span>
                        ${item.file !== '#' 
                            ? `<a href="${item.file}" download class="btn btn-sm btn-primary" style="text-decoration:none; white-space:nowrap;">📥 Download File</a>`
                            : `<button class="btn btn-sm btn-secondary" disabled>Coming Soon</button>`
                        }
                    </div>
                </div>
            `).join('');
        },

        filterCategory(cat, btn) {
            document.querySelectorAll('#tpVaultSection .btn-sm').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            if (btn) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            }

            const filtered = cat === 'All' ? pastPapersData : pastPapersData.filter(p => p.test.toLowerCase().includes(cat.toLowerCase().split(' ')[0]));
            const container = document.getElementById('vaultListContainer');
            if (container) container.innerHTML = this.renderPapers(filtered);
        },

        filterVault() {
            const query = document.getElementById('vaultSearch')?.value.toLowerCase() || '';
            const filtered = pastPapersData.filter(p => p.title.toLowerCase().includes(query) || p.test.toLowerCase().includes(query) || p.subject.toLowerCase().includes(query));
            const container = document.getElementById('vaultListContainer');
            if (container) container.innerHTML = this.renderPapers(filtered);
        },
        addDynamically(aiTest) {
            const existingIndex = entryTestsDatabase.findIndex(t => t.id === aiTest.id);
            if (existingIndex !== -1) {
                entryTestsDatabase[existingIndex] = { ...entryTestsDatabase[existingIndex], ...aiTest };
            } else {
                entryTestsDatabase.push(aiTest);
            }
        },
        searchByQuery(query) {
            const q = query.toLowerCase().trim();
            const words = q.split(/\s+/).filter(w => w.length > 1);
            let best = null;
            let bestScore = 0;
            
            entryTestsDatabase.forEach(t => {
                const name = (t.name || '').toLowerCase().trim();
                const id = (t.id || '').toLowerCase().trim();
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
                    best = t;
                }
            });
            
            return bestScore >= 40 ? { item: best, score: bestScore } : null;
        },
        async addEntryTestOrAcademy() {
            const addType = document.getElementById('tpAddType')?.value || 'test';

            if (addType === 'test') {
                const name = document.getElementById('addTestName')?.value?.trim();
                if (!name) {
                    alert('Please enter an Entry Test Name');
                    return;
                }
                const category = document.getElementById('addTestCategory')?.value?.trim() || 'General';
                const syllabus = document.getElementById('addTestSyllabus')?.value?.trim() || 'Syllabus details coming soon.';
                const timing = document.getElementById('addTestTiming')?.value?.trim() || 'Structure details coming soon.';
                const tips = document.getElementById('addTestTips')?.value?.trim() || 'Tips coming soon.';

                const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
                
                const newTest = {
                    id: id,
                    name: name,
                    category: category,
                    syllabus: syllabus,
                    timing: timing,
                    tips: tips
                };

                entryTestsDatabase.push(newTest);
                if (window.AdminModule) {
                    await window.AdminModule.saveJsonData('test-prep', entryTestsDatabase);
                }
            } else {
                const name = document.getElementById('addAcadName')?.value?.trim();
                if (!name) {
                    alert('Please enter an Academy Name');
                    return;
                }
                const specialty = document.getElementById('addAcadSpecialty')?.value?.trim() || 'Entry Test Prep';
                const rating = document.getElementById('addAcadRating')?.value?.trim() || '4.9 ★';
                const code = document.getElementById('addAcadCode')?.value?.trim() || '';
                const link = document.getElementById('addAcadLink')?.value?.trim() || '#';
                const desc = document.getElementById('addAcadDesc')?.value?.trim() || 'Leading coaching institute for competitive entry tests.';

                const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);

                const newAcad = {
                    id: id,
                    name: name,
                    specialty: specialty,
                    rating: rating,
                    discountCode: code,
                    link: link,
                    description: desc
                };

                academiesDatabase.push(newAcad);
                if (window.AdminModule) {
                    await window.AdminModule.saveJsonData('academies', academiesDatabase);
                }
            }

            this.render('testPrepContainer');
        },

        async startQuiz(subjectId, mode = 'practice') {
            const topicSelect = document.getElementById(`topic_${subjectId}`);
            const selectedTopic = topicSelect ? topicSelect.value : 'ALL';
            
            const subInfo = (mcqSubjectsDatabase && mcqSubjectsDatabase.find(s => s.id === subjectId)) || { title: subjectId.toUpperCase(), color: '#3B82F6' };
            
            try {
                const res = await fetch(`/data/mcqs/${subjectId}.json?t=` + new Date().getTime());
                let questions = await res.json();
                
                if (selectedTopic !== 'ALL') {
                    questions = questions.filter(q => q.topic === selectedTopic);
                }
                
                if (!questions || questions.length === 0) {
                    alert(`No questions found for topic '${selectedTopic}'. Loading full subject questions...`);
                    const fallbackRes = await fetch(`/data/mcqs/${subjectId}.json`);
                    questions = await fallbackRes.json();
                }

                activeQuizState = {
                    subjectId: subjectId,
                    subjectTitle: subInfo.title,
                    color: subInfo.color,
                    mode: mode,
                    questions: questions,
                    currentIndex: 0,
                    userAnswers: {},
                    flagged: {},
                    startTime: Date.now(),
                    timeSeconds: mode === 'exam' ? questions.length * 60 : 0
                };

                if (mode === 'exam' && activeQuizState.timeSeconds > 0) {
                    clearInterval(timerInterval);
                    timerInterval = setInterval(() => {
                        if (!activeQuizState) return;
                        activeQuizState.timeSeconds--;
                        const timerEl = document.getElementById('mcqTimerDisplay');
                        if (timerEl) {
                            const mins = Math.floor(activeQuizState.timeSeconds / 60);
                            const secs = activeQuizState.timeSeconds % 60;
                            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                        }
                        if (activeQuizState.timeSeconds <= 0) {
                            clearInterval(timerInterval);
                            alert('⏱️ Time is up! Submitting your exam...');
                            TestPrepModule.submitQuiz();
                        }
                    }, 1000);
                }

                this.renderActiveQuestion();
                document.getElementById('mcqQuizModal')?.classList.add('active');
            } catch (err) {
                console.error("Error starting quiz:", err);
                alert(`Failed to load ${subInfo.title} question bank.`);
            }
        },

        renderActiveQuestion() {
            if (!activeQuizState) return;
            const q = activeQuizState.questions[activeQuizState.currentIndex];
            const total = activeQuizState.questions.length;
            const idx = activeQuizState.currentIndex;
            const selectedOpt = activeQuizState.userAnswers[idx];
            const isFlagged = activeQuizState.flagged[idx];

            const container = document.getElementById('mcqQuizContent');
            if (!container) return;

            const progressPct = Math.round(((idx + 1) / total) * 100);

            container.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:16px; margin-bottom:20px;">
                    <div>
                        <span class="badge" style="background:var(--accent-subtle); color:${activeQuizState.color}; font-weight:700; font-size:0.8rem; margin-bottom:4px; display:inline-block;">${activeQuizState.subjectTitle} • ${activeQuizState.mode.toUpperCase()} MODE</span>
                        <h3 style="margin:0; font-family:var(--font-display); color:var(--text-primary); font-size:1.3rem;">Question ${idx + 1} of ${total}</h3>
                    </div>
                    <div style="display:flex; align-items:center; gap:16px;">
                        ${activeQuizState.mode === 'exam' ? `
                            <div style="background:var(--bg-elevated); padding:8px 16px; border-radius:20px; font-weight:bold; font-family:monospace; color:var(--accent-primary); border:1px solid var(--border-color);" id="mcqTimerDisplay">
                                ${Math.floor(activeQuizState.timeSeconds / 60).toString().padStart(2, '0')}:${(activeQuizState.timeSeconds % 60).toString().padStart(2, '0')}
                            </div>
                        ` : ''}
                        <button class="btn btn-sm ${isFlagged ? 'btn-primary' : 'btn-secondary'}" onclick="TestPrepModule.toggleFlag()" style="display:flex; align-items:center; gap:6px;">
                            ${isFlagged ? '🚩 Flagged' : '🏳️ Flag for Review'}
                        </button>
                        <button style="background:none; border:none; font-size:1.6rem; color:var(--text-secondary); cursor:pointer;" onclick="TestPrepModule.closeQuizModal()">×</button>
                    </div>
                </div>

                <div style="width:100%; height:6px; background:var(--bg-elevated); border-radius:3px; overflow:hidden; margin-bottom:24px;">
                    <div style="width:${progressPct}%; height:100%; background:${activeQuizState.color}; transition:width 0.3s;"></div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="display:flex; gap:8px; margin-bottom:10px;">
                        <span class="badge" style="background:var(--bg-elevated); color:var(--text-secondary); font-size:0.75rem;">${q.topic || 'General'}</span>
                        <span class="badge" style="background:rgba(245, 158, 11, 0.1); color:#f59e0b; font-size:0.75rem;">${q.difficulty || 'Medium'}</span>
                    </div>
                    <p style="font-size:1.15rem; color:var(--text-primary); font-weight:600; line-height:1.6; margin:0;">${q.question}</p>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                    ${q.options.map((opt, oIdx) => {
                        let btnStyle = "background:var(--bg-surface); border:1px solid var(--border-color); color:var(--text-primary);";
                        let checkIcon = `<span style="width:24px; height:24px; border-radius:50%; border:2px solid var(--border-color); display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem; margin-right:12px;">${String.fromCharCode(65 + oIdx)}</span>`;
                        
                        if (selectedOpt === oIdx) {
                            if (activeQuizState.mode === 'practice') {
                                if (oIdx === q.answer) {
                                    btnStyle = "background:rgba(16, 185, 129, 0.15); border:2px solid #10b981; color:var(--text-primary); font-weight:bold;";
                                    checkIcon = `<span style="width:24px; height:24px; border-radius:50%; background:#10b981; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem; margin-right:12px;">✓</span>`;
                                } else {
                                    btnStyle = "background:rgba(239, 68, 68, 0.15); border:2px solid #ef4444; color:var(--text-primary);";
                                    checkIcon = `<span style="width:24px; height:24px; border-radius:50%; background:#ef4444; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem; margin-right:12px;">✕</span>`;
                                }
                            } else {
                                btnStyle = `background:var(--accent-subtle); border:2px solid ${activeQuizState.color}; color:var(--text-primary); font-weight:bold;`;
                                checkIcon = `<span style="width:24px; height:24px; border-radius:50%; background:${activeQuizState.color}; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem; margin-right:12px;">${String.fromCharCode(65 + oIdx)}</span>`;
                            }
                        } else if (activeQuizState.mode === 'practice' && selectedOpt !== undefined && oIdx === q.answer) {
                            btnStyle = "background:rgba(16, 185, 129, 0.15); border:2px solid #10b981; color:var(--text-primary); font-weight:bold;";
                            checkIcon = `<span style="width:24px; height:24px; border-radius:50%; background:#10b981; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem; margin-right:12px;">✓</span>`;
                        }

                        return `
                            <div onclick="TestPrepModule.selectOption(${oIdx})" style="padding:14px 18px; border-radius:12px; cursor:pointer; display:flex; align-items:center; transition:all 0.15s; ${btnStyle}">
                                ${checkIcon}
                                <span>${opt}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${(activeQuizState.mode === 'practice' && selectedOpt !== undefined && q.explanation) ? `
                    <div style="background:rgba(59, 130, 246, 0.08); border-left:4px solid #3b82f6; padding:16px; border-radius:0 8px 8px 0; margin-bottom:24px;">
                        <h4 style="margin:0 0 6px 0; color:#3b82f6; font-size:0.95rem; font-weight:700; display:flex; align-items:center; gap:6px;">💡 Explanation & Rationale</h4>
                        <p style="margin:0; color:var(--text-primary); font-size:0.9rem; line-height:1.5;">${q.explanation}</p>
                    </div>
                ` : ''}

                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:16px; flex-wrap:wrap; gap:12px;">
                    <button class="btn btn-secondary" onclick="TestPrepModule.prevQuestion()" ${idx === 0 ? 'disabled' : ''}>← Previous</button>
                    
                    <div style="display:flex; gap:6px; max-width:400px; overflow-x:auto; padding:4px 0;">
                        ${activeQuizState.questions.map((_, qI) => {
                            let stateBg = "var(--bg-elevated)";
                            if (activeQuizState.userAnswers[qI] !== undefined) stateBg = activeQuizState.color;
                            if (activeQuizState.flagged[qI]) stateBg = "#f59e0b";
                            if (qI === idx) stateBg = "var(--text-primary)";
                            return `
                                <button onclick="TestPrepModule.jumpToQuestion(${qI})" style="width:28px; height:28px; border-radius:6px; border:none; background:${stateBg}; color:#fff; font-size:0.75rem; font-weight:bold; cursor:pointer; flex-shrink:0;">${qI + 1}</button>
                            `;
                        }).join('')}
                    </div>

                    ${idx === total - 1 ? `
                        <button class="btn btn-primary" onclick="TestPrepModule.submitQuiz()" style="background:#10b981; border:none; font-weight:700;">Submit Test ✓</button>
                    ` : `
                        <button class="btn btn-primary" onclick="TestPrepModule.nextQuestion()" style="background:${activeQuizState.color}; border:none;">Next →</button>
                    `}
                </div>
            `;
            if (window.renderMathInElement) {
                renderMathInElement(container, {
                    delimiters: [
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            }
        },

        selectOption(optIdx) {
            if (!activeQuizState) return;
            activeQuizState.userAnswers[activeQuizState.currentIndex] = optIdx;
            this.renderActiveQuestion();
        },

        toggleFlag() {
            if (!activeQuizState) return;
            const idx = activeQuizState.currentIndex;
            activeQuizState.flagged[idx] = !activeQuizState.flagged[idx];
            this.renderActiveQuestion();
        },

        nextQuestion() {
            if (!activeQuizState) return;
            if (activeQuizState.currentIndex < activeQuizState.questions.length - 1) {
                activeQuizState.currentIndex++;
                this.renderActiveQuestion();
            }
        },

        prevQuestion() {
            if (!activeQuizState) return;
            if (activeQuizState.currentIndex > 0) {
                activeQuizState.currentIndex--;
                this.renderActiveQuestion();
            }
        },

        jumpToQuestion(qI) {
            if (!activeQuizState) return;
            activeQuizState.currentIndex = qI;
            this.renderActiveQuestion();
        },

        closeQuizModal() {
            if (timerInterval) clearInterval(timerInterval);
            document.getElementById('mcqQuizModal')?.classList.remove('active');
        },

        submitQuiz() {
            if (timerInterval) clearInterval(timerInterval);
            this.closeQuizModal();
            this.renderQuizResults();
        },

        renderQuizResults() {
            if (!activeQuizState) return;
            const total = activeQuizState.questions.length;
            let correctCount = 0;
            let wrongCount = 0;
            let unattempted = 0;

            activeQuizState.questions.forEach((q, idx) => {
                const ans = activeQuizState.userAnswers[idx];
                if (ans === undefined) {
                    unattempted++;
                } else if (ans === q.answer) {
                    correctCount++;
                } else {
                    wrongCount++;
                }
            });

            const scorePct = Math.round((correctCount / total) * 100);
            const timeTakenSecs = Math.round((Date.now() - activeQuizState.startTime) / 1000);
            const mins = Math.floor(timeTakenSecs / 60);
            const secs = timeTakenSecs % 60;

            const container = document.getElementById('mcqResultsContent');
            if (!container) return;

            container.innerHTML = `
                <div style="text-align:center; padding-bottom:20px; border-bottom:1px solid var(--border-color);">
                    <span style="font-size:3rem; display:inline-block; margin-bottom:10px;">${scorePct >= 70 ? '🎉' : '📚'}</span>
                    <h2 style="font-family:var(--font-display); margin:0 0 6px 0; color:var(--text-primary);">${scorePct >= 70 ? 'Great Performance!' : 'Keep Practicing!'}</h2>
                    <p style="color:var(--text-secondary); margin:0; font-size:0.95rem;">${activeQuizState.subjectTitle} • Mock Results Summary</p>
                </div>

                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin:24px 0; text-align:center;">
                    <div style="background:var(--bg-elevated); padding:16px 8px; border-radius:12px;">
                        <span style="font-size:1.6rem; font-weight:800; color:var(--accent-primary); font-family:var(--font-display);">${scorePct}%</span>
                        <span style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">ACCURACY</span>
                    </div>
                    <div style="background:rgba(16, 185, 129, 0.1); padding:16px 8px; border-radius:12px;">
                        <span style="font-size:1.6rem; font-weight:800; color:#10b981; font-family:var(--font-display);">${correctCount}</span>
                        <span style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">CORRECT</span>
                    </div>
                    <div style="background:rgba(239, 68, 68, 0.1); padding:16px 8px; border-radius:12px;">
                        <span style="font-size:1.6rem; font-weight:800; color:#ef4444; font-family:var(--font-display);">${wrongCount}</span>
                        <span style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">WRONG</span>
                    </div>
                    <div style="background:var(--bg-elevated); padding:16px 8px; border-radius:12px;">
                        <span style="font-size:1.4rem; font-weight:800; color:var(--text-primary); font-family:monospace;">${mins}m ${secs}s</span>
                        <span style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">TIME SPENT</span>
                    </div>
                </div>

                <div style="max-height:300px; overflow-y:auto; padding-right:8px; margin-bottom:24px; border:1px solid var(--border-color); border-radius:12px; padding:16px;">
                    <h4 style="margin:0 0 12px 0; color:var(--text-primary); font-size:0.95rem;">Detailed Answer Key</h4>
                    ${activeQuizState.questions.map((q, idx) => {
                        const userAns = activeQuizState.userAnswers[idx];
                        const isCorrect = userAns === q.answer;
                        const isUnans = userAns === undefined;
                        return `
                            <div style="padding:12px; border-radius:8px; background:var(--bg-elevated); margin-bottom:10px; border-left:4px solid ${isCorrect ? '#10b981' : isUnans ? '#f59e0b' : '#ef4444'};">
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                    <strong style="font-size:0.88rem; color:var(--text-primary);">Q${idx + 1}: ${q.question}</strong>
                                    <span style="font-size:0.78rem; font-weight:bold; color:${isCorrect ? '#10b981' : isUnans ? '#f59e0b' : '#ef4444'};">
                                        ${isCorrect ? '✓ Correct' : isUnans ? '⏳ Unattempted' : '✕ Wrong'}
                                    </span>
                                </div>
                                <div style="font-size:0.82rem; color:var(--text-secondary);">
                                    Your Answer: <strong>${userAns !== undefined ? q.options[userAns] : 'None'}</strong> | Correct: <strong style="color:#10b981;">${q.options[q.answer]}</strong>
                                </div>
                                <div style="font-size:0.8rem; color:var(--text-tertiary); margin-top:4px; font-style:italic;">💡 ${q.explanation}</div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div style="display:flex; justify-content:space-between; gap:12px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('mcqResultsModal')?.classList.remove('active');">Close Results</button>
                    <button class="btn btn-primary" onclick="document.getElementById('mcqResultsModal')?.classList.remove('active'); TestPrepModule.startQuiz('${activeQuizState.subjectId}', '${activeQuizState.mode}')">Retake Quiz 🔄</button>
                </div>
            `;
            if (window.renderMathInElement) {
                renderMathInElement(container, {
                    delimiters: [
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            }

            document.getElementById('mcqResultsModal')?.classList.add('active');
        },

        openMcqImporterModal() {
            document.getElementById('mcqImporterModal')?.classList.add('active');
        },

        closeMcqImporterModal() {
            document.getElementById('mcqImporterModal')?.classList.remove('active');
        },

        async processMcqImport() {
            const subject = document.getElementById('importSubjectSelect')?.value;
            const text = document.getElementById('importMcqText')?.value?.trim();

            if (!text) {
                alert('Please enter MCQ text or JSON array.');
                return;
            }

            let newMcqs = [];
            try {
                if (text.startsWith('[') || text.startsWith('{')) {
                    const parsed = JSON.parse(text);
                    newMcqs = Array.isArray(parsed) ? parsed : [parsed];
                } else {
                    const qBlocks = text.split(/(?=(?:Q\d+[\.:\)]|\b\d{1,4}[\.:\)]))\s*/i).filter(b => b.trim().length > 10);
                    qBlocks.forEach((block, idx) => {
                        const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
                        if (lines.length >= 2) {
                            const questionText = lines[0].replace(/^(?:Q\d+[\.:\)]|\b\d{1,4}[\.:\)])\s*/i, '').trim();
                            const options = lines.filter(l => /^[A-D][\.\)]|\([A-D]\)/i.test(l)).map(l => l.replace(/^[A-D][\.\)]|\([A-D]\)\s*/i, '').trim());
                            
                            newMcqs.push({
                                id: `${subject.slice(0,3)}_${Date.now()}_${idx}`,
                                subjectId: subject,
                                topic: "Imported Practice",
                                difficulty: "Medium",
                                question: questionText,
                                options: options.length === 4 ? options : ["Option A", "Option B", "Option C", "Option D"],
                                answer: 0,
                                explanation: "Practice explanation."
                            });
                        }
                    });
                }

                if (newMcqs.length === 0) {
                    alert('Could not parse any MCQs from input.');
                    return;
                }

                const res = await fetch(`/data/mcqs/${subject}.json`);
                const existing = await res.json();
                const combined = [...existing, ...newMcqs];

                if (window.AdminModule) {
                    await window.AdminModule.saveJsonData(`mcqs/${subject}`, combined);
                }

                alert(`Successfully imported ${newMcqs.length} MCQs into ${subject.toUpperCase()}!`);
                this.closeMcqImporterModal();
                loadMcqSubjects();
            } catch (e) {
                alert('Parsing failed: ' + e.message);
            }
        },

        // ─── REDESIGNED MULTI-STEP PRACTICE FLOW & NOTEPAD / FILTERS ───
        activePracticeState: {
            subjectId: null,
            subjectTitle: '',
            topicName: '',
            questions: [],
            filteredQuestions: [],
            currentIndex: 0,
            attemptedMap: {},
            statusFilter: 'ALL',
            testFilter: 'ALL',
            selectedTests: ['ALL'],
            difficultyFilter: 'ALL',
            pastPaperFilter: 'ALL',
            mockMcqCount: 20
        },

        selectSubject(subjectId) {
            const topBanner = document.getElementById('tpTopBanner');
            if (topBanner) topBanner.style.display = 'block';

            const sub = mcqSubjectsDatabase.find(s => s.id === subjectId);
            if (!sub) return;

            this.activePracticeState.subjectId = subjectId;
            this.activePracticeState.subjectTitle = sub.title;

            document.getElementById('topicSubjectHeaderTitle').textContent = sub.title;
            const container = document.getElementById('topicsListContainer');

            if (container) {
                container.innerHTML = (sub.topics || []).map(t => {
                    const topicName = typeof t === 'string' ? t : t.name;
                    const total = typeof t === 'object' ? t.total : 85;
                    const attempted = this.activePracticeState.attemptedMap[`${subjectId}_${topicName}`] || 0;

                    return `
                        <div onclick="TestPrepModule.selectTopic('${topicName}')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px 24px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:transform 0.15s, border-color 0.15s;" onmouseover="this.style.transform='translateX(4px)'; this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-color)'">
                            <div>
                                <h4 style="margin:0 0 4px 0; color:var(--text-primary); font-size:1.05rem; font-family:var(--font-display); font-weight:700;">${topicName}</h4>
                                <span style="font-size:0.85rem; color:var(--accent-primary); font-weight:600;">${attempted}/${total}</span>
                            </div>
                            <span style="font-size:1.2rem; color:var(--text-secondary);">❯</span>
                        </div>
                    `;
                }).join('');
            }

            document.getElementById('practiceStepSubjects').style.display = 'none';
            document.getElementById('practiceStepTopics').style.display = 'block';
            document.getElementById('practiceStepMcqs').style.display = 'none';
        },

        backToSubjects() {
            const topBanner = document.getElementById('tpTopBanner');
            if (topBanner) topBanner.style.display = 'block';

            document.getElementById('practiceStepSubjects').style.display = 'block';
            document.getElementById('practiceStepTopics').style.display = 'none';
            document.getElementById('practiceStepMcqs').style.display = 'none';
        },

        async selectTopic(topicName) {
            this.activePracticeState.topicName = topicName;
            const subjectId = this.activePracticeState.subjectId;

            try {
                const res = await fetch(`/data/mcqs/${subjectId}.json?t=` + new Date().getTime());
                let allQuestions = await res.json();
                
                let topicQuestions = allQuestions.filter(q => q.topic === topicName);
                if (topicQuestions.length === 0) {
                    topicQuestions = allQuestions;
                }

                this.activePracticeState.questions = topicQuestions;
                this.activePracticeState.filteredQuestions = [...topicQuestions];
                this.activePracticeState.currentIndex = 0;

                this.renderMcqScreen();

                const topBanner = document.getElementById('tpTopBanner');
                if (topBanner) topBanner.style.display = 'none';

                document.getElementById('practiceStepSubjects').style.display = 'none';
                document.getElementById('practiceStepTopics').style.display = 'none';
                document.getElementById('practiceStepMcqs').style.display = 'block';
            } catch (e) {
                console.error("Error loading topic questions:", e);
                alert("Failed to load question bank for " + topicName);
            }
        },

        backToTopics() {
            const topBanner = document.getElementById('tpTopBanner');
            if (topBanner) topBanner.style.display = 'block';

            document.getElementById('practiceStepSubjects').style.display = 'none';
            document.getElementById('practiceStepTopics').style.display = 'block';
            document.getElementById('practiceStepMcqs').style.display = 'none';
        },

        renderMcqScreen() {
            const state = this.activePracticeState;
            const list = state.filteredQuestions;
            const idx = state.currentIndex;

            document.getElementById('mcqBreadcrumb').textContent = `${state.subjectTitle} - Chapter / ${state.topicName}`;
            
            const attemptedCount = Object.keys(state.attemptedMap).filter(k => k.startsWith(`${state.subjectId}_${state.topicName}_`)).length;
            document.getElementById('mcqAttemptedCounter').textContent = `Attempted: ${attemptedCount}`;
            document.getElementById('mcqProgressPill').textContent = `${list.length > 0 ? idx + 1 : 0}/${list.length}`;

            const qCard = document.getElementById('mcqQuestionCard');
            if (!qCard) return;

            if (list.length === 0) {
                qCard.innerHTML = `
                    <div style="text-align:center; padding:40px 20px;">
                        <span style="font-size:3rem; display:block; margin-bottom:12px;">🔍</span>
                        <h4 style="color:var(--text-primary); margin-bottom:8px;">No MCQs match your selected filters.</h4>
                        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:16px;">Try resetting difficulty or status filters.</p>
                        <button class="btn btn-sm btn-primary" onclick="TestPrepModule.openFilterModal()">Change Filters</button>
                    </div>
                `;
                return;
            }

            const q = list[idx];
            const qKey = `${state.subjectId}_${state.topicName}_${q.id}`;
            const selectedOpt = state.attemptedMap[qKey];

            qCard.innerHTML = `
                <div class="mcq-q-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <span class="badge" style="background:var(--bg-elevated); color:var(--text-secondary); font-size:0.75rem; padding:2px 8px;">${q.topic || state.topicName}</span>
                        ${q.testTag ? `<span class="badge" style="background:rgba(176, 38, 255, 0.1); color:var(--accent-primary); font-size:0.75rem; padding:2px 8px;">${q.testTag}</span>` : ''}
                        <span class="badge" style="background:rgba(245, 158, 11, 0.1); color:#f59e0b; font-size:0.75rem; padding:2px 8px;">${q.difficulty || 'Medium'}</span>
                    </div>
                </div>

                <p class="mcq-q-text" style="font-size:1.05rem; color:var(--text-primary); font-weight:600; line-height:1.5; margin:0 0 16px 0;">${q.question}</p>

                <div class="mcq-options-container" style="display:flex; flex-direction:column; gap:8px;">
                    ${q.options.map((opt, oIdx) => {
                        let btnStyle = "background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary);";
                        let checkBadge = `<span class="mcq-opt-badge" style="width:24px; height:24px; border-radius:50%; background:var(--bg-surface); border:1px solid var(--border-color); display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem; margin-right:12px; color:var(--text-primary); flex-shrink:0;">${String.fromCharCode(65 + oIdx)}</span>`;

                        if (selectedOpt === oIdx) {
                            if (oIdx === q.answer) {
                                btnStyle = "background:rgba(16, 185, 129, 0.1); border:1px solid #10b981; color:var(--text-primary); font-weight:bold;";
                                checkBadge = `<span class="mcq-opt-badge" style="width:24px; height:24px; border-radius:50%; background:#10b981; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem; margin-right:12px; flex-shrink:0;">✓</span>`;
                            } else {
                                btnStyle = "background:rgba(239, 68, 68, 0.1); border:1px solid #ef4444; color:var(--text-primary); font-weight:bold;";
                                checkBadge = `<span class="mcq-opt-badge" style="width:24px; height:24px; border-radius:50%; background:#ef4444; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem; margin-right:12px; flex-shrink:0;">✗</span>`;
                            }
                        } else if (selectedOpt !== undefined && oIdx === q.answer) {
                            btnStyle = "background:rgba(16, 185, 129, 0.1); border:1px solid #10b981; color:var(--text-primary); font-weight:bold;";
                            checkBadge = `<span class="mcq-opt-badge" style="width:24px; height:24px; border-radius:50%; background:#10b981; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem; margin-right:12px; flex-shrink:0;">✓</span>`;
                        }

                        return `
                            <div class="mcq-option" onclick="TestPrepModule.selectMcqOption(${oIdx})" style="padding:10px 14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; transition:all 0.15s; ${btnStyle}">
                                ${checkBadge}
                                <span style="font-size:0.9rem; line-height:1.4;">${opt}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${(selectedOpt !== undefined && q.explanation) ? `
                    <div style="background:rgba(59, 130, 246, 0.08); border-left:4px solid #3b82f6; padding:16px; border-radius:0 12px 12px 0; margin-top:24px;">
                        <h4 style="margin:0 0 6px 0; color:#3b82f6; font-size:0.95rem; font-weight:700;">💡 Explanation</h4>
                        <p style="margin:0; color:var(--text-primary); font-size:0.9rem; line-height:1.5;">${q.explanation}</p>
                    </div>
                ` : ''}
            `;

            if (window.renderMathInElement && qCard) {
                setTimeout(() => {
                    try {
                        window.renderMathInElement(qCard, {
                            delimiters: [
                                {left: '$$', right: '$$', display: true},
                                {left: '$', right: '$', display: false},
                                {left: '\\(', right: '\\)', display: false},
                                {left: '\\[', right: '\\]', display: true}
                            ],
                            throwOnError: false
                        });
                    } catch (e) { console.error("KaTeX rendering:", e); }
                }, 20);
            }
        },

        selectMcqOption(optIdx) {
            const state = this.activePracticeState;
            const q = state.filteredQuestions[state.currentIndex];
            if (!q) return;

            const qKey = `${state.subjectId}_${state.topicName}_${q.id}`;
            state.attemptedMap[qKey] = optIdx;

            const topicKey = `${state.subjectId}_${state.topicName}`;
            const attemptedCount = Object.keys(state.attemptedMap).filter(k => k.startsWith(`${topicKey}_`)).length;
            state.attemptedMap[topicKey] = attemptedCount;

            this.renderMcqScreen();
        },

        nextMcq() {
            if (this.activePracticeState.currentIndex < this.activePracticeState.filteredQuestions.length - 1) {
                this.activePracticeState.currentIndex++;
                this.renderMcqScreen();
            }
        },

        prevMcq() {
            if (this.activePracticeState.currentIndex > 0) {
                this.activePracticeState.currentIndex--;
                this.renderMcqScreen();
            }
        },

        resetTopicProgress() {
            if (confirm("Reset progress for this topic?")) {
                const state = this.activePracticeState;
                const topicKey = `${state.subjectId}_${state.topicName}`;
                Object.keys(state.attemptedMap).forEach(k => {
                    if (k.startsWith(`${topicKey}_`) || k === topicKey) {
                        delete state.attemptedMap[k];
                    }
                });
                state.currentIndex = 0;
                this.renderMcqScreen();
            }
        },

        // ─── DRAWING NOTEPAD LOGIC ───
        toggleNotepad() {
            const modal = document.getElementById('notepadOverlayModal');
            if (!modal) return;

            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
            } else {
                modal.classList.add('active');
                setTimeout(() => this.initNotepadCanvas(), 100);
            }
        },

        initNotepadCanvas() {
            const canvas = document.getElementById('notepadCanvas');
            const container = document.getElementById('notepadCanvasContainer');
            if (!canvas || !container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            let drawing = false;

            canvas.onmousedown = (e) => {
                drawing = true;
                ctx.beginPath();
                const rect = canvas.getBoundingClientRect();
                ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            };

            canvas.onmousemove = (e) => {
                if (!drawing) return;
                const rect = canvas.getBoundingClientRect();
                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                ctx.stroke();
            };

            canvas.onmouseup = () => drawing = false;
            canvas.onmouseleave = () => drawing = false;

            canvas.ontouchstart = (e) => {
                drawing = true;
                ctx.beginPath();
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
            };
            canvas.ontouchmove = (e) => {
                if (!drawing) return;
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                ctx.stroke();
            };
            canvas.ontouchend = () => drawing = false;
        },

        clearNotepadCanvas() {
            const canvas = document.getElementById('notepadCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        },

        // ─── FILTER MODAL LOGIC ───
        openFilterModal() {
            document.getElementById('mcqFilterModal')?.classList.add('active');
        },

        closeFilterModal() {
            document.getElementById('mcqFilterModal')?.classList.remove('active');
        },

        setStatusFilter(status, btn) {
            document.querySelectorAll('.filter-status-chip').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            if (btn) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            }
            this.activePracticeState.statusFilter = status;
        },

        toggleEntryTestFilter(testTag, btn) {
            const state = this.activePracticeState;
            if (!state.selectedTests) state.selectedTests = ['ALL'];

            if (testTag === 'ALL') {
                state.selectedTests = ['ALL'];
            } else {
                state.selectedTests = state.selectedTests.filter(t => t !== 'ALL');
                const idx = state.selectedTests.indexOf(testTag);
                if (idx !== -1) {
                    state.selectedTests.splice(idx, 1);
                } else {
                    state.selectedTests.push(testTag);
                }

                if (state.selectedTests.length === 0) {
                    state.selectedTests = ['ALL'];
                }
            }

            // Update Chip UI highlights
            document.querySelectorAll('.filter-test-chip').forEach(b => {
                const t = b.getAttribute('data-test');
                if (state.selectedTests.includes(t)) {
                    b.classList.remove('btn-secondary');
                    b.classList.add('btn-primary');
                } else {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                }
            });
        },

        applyFilters() {
            const state = this.activePracticeState;
            const difficulty = document.getElementById('filterDifficulty')?.value || 'ALL';
            const pastPaper = document.getElementById('filterPastPaper')?.value || 'ALL';

            state.difficultyFilter = difficulty;
            state.pastPaperFilter = pastPaper;

            let filtered = [...state.questions];

            if (state.statusFilter === 'ATTEMPTED') {
                filtered = filtered.filter(q => state.attemptedMap[`${state.subjectId}_${state.topicName}_${q.id}`] !== undefined);
            } else if (state.statusFilter === 'UNATTEMPTED') {
                filtered = filtered.filter(q => state.attemptedMap[`${state.subjectId}_${state.topicName}_${q.id}`] === undefined);
            }

            // Multi-Select Entry Test Filter
            if (state.selectedTests && !state.selectedTests.includes('ALL') && state.selectedTests.length > 0) {
                filtered = filtered.filter(q => {
                    const tag = (q.testTag || '').toUpperCase();
                    return state.selectedTests.some(t => tag.includes(t));
                });
            }

            if (difficulty !== 'ALL') {
                filtered = filtered.filter(q => (q.difficulty || '').toLowerCase() === difficulty.toLowerCase());
            }

            if (pastPaper === 'YES') {
                filtered = filtered.filter(q => q.isPastPaper === true);
            }

            state.filteredQuestions = filtered;
            state.currentIndex = 0;

            this.renderMcqScreen();
            this.closeFilterModal();
        },

        // ─── CUSTOM MOCK TEST SETUP ───
        openMockSetupModal() {
            const modal = document.getElementById('mockSetupModal');
            if (modal) {
                modal.classList.add('active');
                const subSelect = document.getElementById('mockSubjectSelect');
                if (subSelect && subSelect.value) {
                    this.populateMockTopics(subSelect.value);
                }
            }
        },

        closeMockSetupModal() {
            document.getElementById('mockSetupModal')?.classList.remove('active');
        },

        populateMockTopics(subjectId) {
            const sub = mcqSubjectsDatabase.find(s => s.id === subjectId);
            const topicSelect = document.getElementById('mockTopicSelect');
            if (sub && topicSelect) {
                topicSelect.innerHTML = `<option value="ALL">All Topics (Full Subject Mock)</option>` + 
                    (sub.topics || []).map(t => `<option value="${typeof t === 'string' ? t : t.name}">${typeof t === 'string' ? t : t.name}</option>`).join('');
            }
        },

        setMockMcqCount(cnt, btn) {
            document.querySelectorAll('.mock-mcq-cnt-btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            if (btn) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            }
            this.activePracticeState.mockMcqCount = cnt;
        },

        async launchCustomMock() {
            const subjectId = document.getElementById('mockSubjectSelect')?.value || 'physics';
            const topic = document.getElementById('mockTopicSelect')?.value || 'ALL';
            const timerMins = parseInt(document.getElementById('mockTimerSelect')?.value || '20', 10);
            const mcqCount = this.activePracticeState.mockMcqCount || 20;

            this.closeMockSetupModal();

            try {
                const res = await fetch(`/data/mcqs/${subjectId}.json?t=` + new Date().getTime());
                let allQ = await res.json();

                if (topic !== 'ALL') {
                    allQ = allQ.filter(q => q.topic === topic);
                }

                if (allQ.length === 0) {
                    alert("No questions available for selected topic.");
                    return;
                }

                const questions = allQ.sort(() => 0.5 - Math.random()).slice(0, mcqCount);

                activeQuizState = {
                    subjectId: subjectId,
                    subjectTitle: subjectId.toUpperCase(),
                    color: '#B026FF',
                    mode: 'exam',
                    questions: questions,
                    currentIndex: 0,
                    userAnswers: {},
                    flagged: {},
                    startTime: Date.now(),
                    timeSeconds: timerMins * 60
                };

                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    if (!activeQuizState) return;
                    activeQuizState.timeSeconds--;
                    const timerEl = document.getElementById('mcqTimerDisplay');
                    if (timerEl) {
                        const mins = Math.floor(activeQuizState.timeSeconds / 60);
                        const secs = activeQuizState.timeSeconds % 60;
                        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    }
                    if (activeQuizState.timeSeconds <= 0) {
                        clearInterval(timerInterval);
                        alert('⏱️ Time is up! Submitting your mock exam...');
                        TestPrepModule.submitQuiz();
                    }
                }, 1000);

                this.renderActiveQuestion();
                document.getElementById('mcqQuizModal')?.classList.add('active');
            } catch (e) {
                console.error("Error launching mock exam:", e);
                alert("Failed to launch mock exam.");
            }
        }

    };
})();
