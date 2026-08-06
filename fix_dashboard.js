const fs = require('fs');

const file = 'c:/Users/HAFIZ ABU BAKER/Downloads/SCOLARY AI/public/dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// The chunk we accidentally removed
const missingScript = `
                <script>
                    function toggleUnifiedCategory() {
                        const mode = document.getElementById('universalModeSelect').value;
                        const catWrap = document.getElementById('universalCategoryWrapper');
                        const catDiv = document.getElementById('universalCategoryDivider');
                        const input = document.getElementById('universalSearchInput');
                        
                        if (mode === 'program') {
                            catWrap.style.display = 'flex';
                            catDiv.style.display = 'block';
                            input.placeholder = "Enter exact University, Scholarship, or Program name...";
                        } else {
                            catWrap.style.display = 'none';
                            catDiv.style.display = 'none';
                            input.placeholder = "Type your academic question or university name...";
                        }
                    }
                    
                    async function executeSearch() {
                        if (window.showToast) window.showToast('Searching grounded academic database...', 'info');
                        const resultsDiv = document.getElementById('aiSearchResults');
                        
                        const queryVal = document.getElementById('universalSearchInput').value;
                        const mode = document.getElementById('universalModeSelect').value;
                        const scope = document.getElementById('universalScopeSelect').value;
                        const category = document.getElementById('universalCategorySelect').value;
                        
                        if (!queryVal.trim()) {
                            if (window.showToast) window.showToast('Please enter a search query', 'warning');
                            return;
                        }

                        // INSTANT LOCAL HUB INTERCEPTION:
                        // If the user searches for a university we already have full HTML for, show it instantly!
                        if (mode === 'program' && category.toLowerCase() === 'university' && window.UniversitiesModule && window.UniversitiesModule.searchByQuery) {
                            const localUni = window.UniversitiesModule.searchByQuery(queryVal);
                            if (localUni) {
                                if (window.showToast) window.showToast('Found in local Universities Hub!', 'success');
                                const html = window.UniversitiesModule.getRenderDetailView(localUni);
                                // Append Save to Bookmarks button
                                const saveBtnHTML = \`
                                    <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end;">
                                        <button class="btn" style="background:var(--accent-primary); color:#fff; font-size:0.85rem; padding:8px 16px; border-radius:6px; cursor:pointer;" onclick='saveSearchResult("\${(localUni.name || 'Search Result').replace(/'/g, "\\\\'")}", "university", \${JSON.stringify(localUni).replace(/'/g, "&apos;")})'>
                                            📌 Save to Timeline
                                        </button>
                                    </div>
                                \`;
                                resultsDiv.innerHTML = html + saveBtnHTML;
                                return; // Stop here, no need to hit the AI backend!
                            }
                        }

                        resultsDiv.innerHTML = '<div style="text-align:center; padding:40px;"><div style="font-size:2rem; margin-bottom:16px;">✨</div><p style="color:var(--text-secondary);">Searching sequentially across selected trusted websites...</p></div>';
                        
                        try {
                            const payload = mode === 'simple' 
                                ? { mode: 'simple', query: queryVal, scope }
                                : { mode: 'program', program: queryVal, category: category, scope };
                                
                            const response = await fetch('/api/search', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            const data = await response.json();
                            
                            if (data.error) throw new Error(data.error);

                            if (data.notFound) {
                                resultsDiv.innerHTML = \`
                                    <div style="padding: 20px; background: rgba(255, 107, 107, 0.1); border-radius: 12px; border: 1px solid rgba(255, 107, 107, 0.3); color: var(--status-danger); text-align: center;">
                                        <h3 style="margin-bottom:8px;">⚠️ No Program or University Found</h3>
                                        <p style="margin:0; font-size:0.9rem;">\${data.message || data.answer || 'Searched all 4 websites sequentially, but no matching program was found.'}</p>
                                    </div>
                                \`;
                                return;
                            }
                            
                            if (mode === 'simple') {
                                resultsDiv.innerHTML = \`<div style="padding: 20px; background: var(--bg-elevated); border-radius: 12px; border: 1px solid var(--border-color);">
                                    <h4 style="color:var(--accent-primary); margin-bottom:8px;">💡 AI Answer</h4>
                                    <div style="line-height:1.6;">\${data.answer}</div>
                                </div>\`;
                            } else {
                                const r = data.result || {};
                                const cat = category.toLowerCase();
                                let html = '';

                                if (cat === 'university') {
                                    if (window.UniversitiesModule && window.UniversitiesModule.addDynamically) {
                                        window.UniversitiesModule.addDynamically(r);
                                    }
                                    if (window.UniversitiesModule && window.UniversitiesModule.getUniById && window.UniversitiesModule.getUniById(r.id)) {
                                        const uniData = window.UniversitiesModule.getUniById(r.id);
                                        html = window.UniversitiesModule.getRenderDetailView(uniData);
                                    } else {
                                        html = \`
                                        <div style="padding: 24px; background: var(--bg-elevated); border-radius: 12px; border: 1px solid var(--border-color); color: var(--text-primary);">
                                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                                <h2 style="font-size:1.4rem; font-family:var(--font-display); font-weight:700; color:var(--accent-primary); margin:0;">🏛️ \${r.name || 'University Details'}</h2>
                                                \${r.since ? \`<span style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:4px 10px; border-radius:var(--radius-full); font-size:0.8rem;">Est. \${r.since}</span>\` : ''}
                                            </div>
                                            \${r.introduction ? \`<p style="color:var(--text-secondary); margin-bottom:16px;">\${r.introduction}</p>\` : ''}
                                            
                                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:16px;">
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">📍 City</strong>
                                                    <span>\${r.city || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">🏛️ Type</strong>
                                                    <span>\${r.type || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">⚙️ Sector</strong>
                                                    <span>\${r.sector || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">🏅 Ranking</strong>
                                                    <span>\${r.ranking || 'Information not specified'}</span>
                                                </div>
                                            </div>

                                            \${r.programs ? \`<div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:6px; color:var(--text-primary);">📚 Offered Programs</strong>
                                                <ul style="padding-left:18px; margin:0; color:var(--text-secondary);">\${Array.isArray(r.programs) ? r.programs.map((p, i) => \`<li style="margin-bottom:4px;">\${i+1}. \${p}</li>\`).join('') : r.programs}</ul>
                                            </div>\` : ''}

                                            \${r.requirements ? \`<div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:4px; color:var(--text-primary);">📋 Admission Requirements</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.requirements}</p>
                                            </div>\` : ''}

                                            \${r.fee_structure ? \`<div>
                                                <strong style="display:block; margin-bottom:4px; color:var(--text-primary);">💰 Fee Structure</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.fee_structure}</p>
                                            </div>\` : ''}
                                        </div>
                                    \`;
                                    }
                                } else if (cat === 'scholarship') {
                                    let reqDocsHtml = 'Information not specified';
                                    if (r.required_documents && Array.isArray(r.required_documents)) {
                                        reqDocsHtml = r.required_documents.map(d => \`<span style="background:var(--bg-elevated); padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-right:6px; margin-bottom:6px; display:inline-block;">📄 \${d}</span>\`).join('');
                                    } else if (r.requiredDocuments) {
                                        reqDocsHtml = r.requiredDocuments.split(',').map(d => \`<span style="background:var(--bg-elevated); padding:4px 8px; border-radius:4px; font-size:0.8rem; margin-right:6px; margin-bottom:6px; display:inline-block;">📄 \${d.trim()}</span>\`).join('');
                                    }

                                    html = \`
                                        <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid var(--border-color); color: var(--text-primary);">
                                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                                <h2 style="font-size:1.4rem; font-family:var(--font-display); font-weight:700; color:var(--accent-primary); margin:0;">🏆 \${r.title || 'Scholarship Details'}</h2>
                                                \${r.deadline ? \`<span style="background:var(--status-warning-glow); color:var(--status-warning); padding:4px 10px; border-radius:var(--radius-full); font-size:0.8rem; font-weight:600;">⏳ Deadline: \${r.deadline}</span>\` : ''}
                                            </div>
                                            <p style="color:var(--text-secondary); margin-bottom:16px;"><strong>Provider:</strong> \${r.provider || 'Information not specified'}</p>
                                            \${r.description || r.introduction ? \`<p style="color:var(--text-secondary); margin-bottom:16px;">\${r.description || r.introduction}</p>\` : ''}

                                            <div style="background:var(--bg-surface); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:16px;">
                                                <strong style="display:block; font-size:0.85rem; color:var(--accent-primary); margin-bottom:4px;">💵 Coverage & Financial Benefit</strong>
                                                <p style="margin:0; color:var(--text-primary);">\${r.coverage || r.amount_coverage || 'Information not specified'}</p>
                                            </div>

                                            <div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:4px;">✅ Eligibility Criteria</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.eligibilityCriteria || r.eligibility_criteria || 'Information not specified'}</p>
                                            </div>

                                            <div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:4px;">📝 Application Process</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.applicationProcess || r.application_process || 'Information not specified'}</p>
                                            </div>

                                            <div>
                                                <strong style="display:block; margin-bottom:8px;">📎 Required Documents</strong>
                                                <div>\${reqDocsHtml}</div>
                                            </div>
                                        </div>
                                    \`;
                                } else if (cat === 'test') {
                                    html = \`
                                        <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid var(--border-color); color: var(--text-primary);">
                                            <h2 style="font-size:1.4rem; font-family:var(--font-display); font-weight:700; color:var(--accent-primary); margin-bottom:8px;">🎯 \${r.test_name || 'Entry Test Details'}</h2>
                                            <p style="color:var(--text-secondary); margin-bottom:16px;"><strong>Conducting Body:</strong> \${r.conducting_body || 'Information not specified'}</p>
                                            <p style="color:var(--text-secondary); margin-bottom:16px;">\${r.introduction || ''}</p>

                                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:16px;">
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">📅 Test Date</strong>
                                                    <span>\${r.test_date || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">⏳ Registration Deadline</strong>
                                                    <span>\${r.registration_deadline || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">💳 Registration Fee</strong>
                                                    <span>\${r.fee || 'Information not specified'}</span>
                                                </div>
                                            </div>

                                            <div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:4px;">📊 Syllabus & Marks Weightage</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.syllabus_weightage || 'Information not specified'}</p>
                                            </div>

                                            <div>
                                                <strong style="display:block; margin-bottom:4px;">🎯 Passing / Merit Criteria</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.passing_criteria || 'Information not specified'}</p>
                                            </div>
                                        </div>
                                    \`;
                                } else {
                                    const unis = Array.isArray(r.offering_universities) && r.offering_universities.length > 0 
                                        ? r.offering_universities.map(u => \`<span style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full); font-size:0.85rem; margin-right:6px; margin-bottom:6px; display:inline-block;">🎓 \${u}</span>\`).join('') 
                                        : 'Information not specified';
                                        
                                    html = \`
                                        <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid var(--border-color); color: var(--text-primary);">
                                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                                <h2 style="font-size:1.4rem; font-family:var(--font-display); font-weight:700; color:var(--accent-primary); margin:0;">📘 \${r.program_name || 'Program Details'}</h2>
                                                \${r.duration ? \`<span style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:4px 10px; border-radius:var(--radius-full); font-size:0.8rem;">⏱️ \${r.duration}</span>\` : ''}
                                            </div>
                                            <p style="color:var(--text-secondary); margin-bottom:16px;">\${r.introduction || ''}</p>

                                            <div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:8px;">🏛️ Top Offering Universities</strong>
                                                <div>\${unis}</div>
                                            </div>

                                            <div style="margin-bottom:16px;">
                                                <strong style="display:block; margin-bottom:4px;">🎓 Prerequisite & Eligibility</strong>
                                                <p style="color:var(--text-secondary); margin:0;">\${r.eligibility || 'Information not specified'}</p>
                                            </div>

                                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">💼 Career Prospects</strong>
                                                    <span>\${r.career_prospects || 'Information not specified'}</span>
                                                </div>
                                                <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                                                    <strong style="display:block; font-size:0.8rem; color:var(--text-secondary);">💵 Average Starting Salary</strong>
                                                    <span>\${r.average_starting_salary || 'Information not specified'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    \`;
                                }

                                // Append Save to Bookmarks button
                                const saveBtnHTML = \`
                                    <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end;">
                                        <button class="btn" style="background:var(--accent-primary); color:#fff; font-size:0.85rem; padding:8px 16px; border-radius:6px; cursor:pointer;" onclick='saveSearchResult("\${(r.name || r.title || r.test_name || r.program_name || 'Search Result').replace(/'/g, "\\\\'")}", "\${cat}", \${JSON.stringify(r).replace(/'/g, "&apos;")})'>
                                            📌 Save to Timeline
                                        </button>
                                    </div>
                                \`;

                                resultsDiv.innerHTML = html + saveBtnHTML;
                            }
                        } catch (e) {
                            resultsDiv.innerHTML = \`<p style="color:var(--status-danger);">Error: \${e.message}</p>\`;
                        }
                    }

                    // Save result to Timeline feature
                    function saveSearchResult(title, type, data) {
                        try {
                            const list = JSON.parse(localStorage.getItem('scholarpath_saved_results') || '[]');
                            const newItem = { id: Date.now().toString(), title, type, data, savedAt: new Date().toLocaleDateString() };
                            list.unshift(newItem);
                            localStorage.setItem('scholarpath_saved_results', JSON.stringify(list));
                            if (window.showToast) window.showToast(\`Saved "\${title}" to your Saved Timeline!\`, 'success');
                            renderSavedItemsToTimeline();
                        } catch (err) {
                            console.error(err);
                            if (window.showToast) window.showToast('Failed to save result.', 'warning');
                        }
                    }

                    // Render saved items in the TIMELINE SECTION (#view-timeline)
                    function renderSavedItemsToTimeline() {
                        const timelineContainer = document.getElementById('timelineContainer');
                        if (!timelineContainer) return;

                        const list = JSON.parse(localStorage.getItem('scholarpath_saved_results') || '[]');
                        if (list.length === 0) {
                            timelineContainer.innerHTML = \`
                                <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:30px; border-radius:12px; text-align:center;">
                                    <h3 style="font-size:1.2rem; margin-bottom:8px;">📌 Your Saved Timeline is Empty</h3>
                                    <p style="color:var(--text-secondary); font-size:0.9rem;">Search any university, scholarship, or program, and click "Save to Timeline" to pin it here.</p>
                                </div>
                            \`;
                            return;
                        }

                        let itemsHTML = list.map((item) => \`
                            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 16px 20px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <strong style="color: var(--text-primary); font-size:1rem;">\${item.title}</strong>
                                        <span style="background:var(--bg-elevated); border:1px solid var(--border-color); padding:2px 8px; border-radius:4px; font-size:0.75rem; text-transform:uppercase; color:var(--accent-primary); font-weight:600;">\${item.type}</span>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top:4px;">Saved on \${item.savedAt}</div>
                                </div>
                                <button class="btn" style="background: rgba(255,107,107,0.15); color: var(--status-danger); border: 1px solid rgba(255,107,107,0.3); padding: 6px 14px; font-size: 0.8rem; border-radius: 6px; cursor:pointer;" onclick="removeSavedItem('\${item.id}')">Remove</button>
                            </div>
                        \`).join('');

                        timelineContainer.innerHTML = \`
                            <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:24px; border-radius:12px; max-width:800px; margin:0 auto;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                                    <h2 style="font-size:1.3rem; margin:0; font-family:var(--font-display);">📌 Saved Timeline & Bookmarks (\${list.length})</h2>
                                    <button onclick="clearAllSaved()" style="background:none; border:none; color:var(--status-warning); font-size:0.8rem; cursor:pointer; font-weight:600;">Clear All</button>
                                </div>
                                \${itemsHTML}
                            </div>
                        \`;
                    }

                    function removeSavedItem(id) {
                        let list = JSON.parse(localStorage.getItem('scholarpath_saved_results') || '[]');
                        list = list.filter(i => i.id !== id);
                        localStorage.setItem('scholarpath_saved_results', JSON.stringify(list));
                        if (window.showToast) window.showToast('Item removed from Saved Timeline.', 'info');
                        renderSavedItemsToTimeline();
                    }

                    function clearAllSaved() {
                        localStorage.removeItem('scholarpath_saved_results');
                        if (window.showToast) window.showToast('Cleared all items from Saved Timeline.', 'info');
                        renderSavedItemsToTimeline();
                    }

                    // Render saved items in Timeline when page loads
                    document.addEventListener('DOMContentLoaded', () => {
                        setTimeout(renderSavedItemsToTimeline, 500);
                    });
                </script>
`;

if (!content.includes('function toggleUnifiedCategory()')) {
    content = content.replace('<!-- ===== 3. TIMELINE VIEW ===== -->', missingScript + '\n                <!-- ===== 3. TIMELINE VIEW ===== -->');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Restored the missing script block.');
} else {
    console.log('Script block is already present.');
}
