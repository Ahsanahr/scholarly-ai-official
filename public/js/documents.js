/**
 * SCHOLARLY AI — Document Vault & Verification Hub Module
 * Advanced document tracking with deadlines, simulated file uploads (localStorage),
 * dynamic custom documents, gamified progress, and interactive Verification pipelines.
 */

class DocumentChecklist {
    constructor() {
        this.storageKey = 'scholarly_documents_v3';
        this.documents = this.load();
        this.currentTab = 'vault';
        this.injectStyles();
    }

    injectStyles() {
        if (!document.getElementById('documentVaultStyles')) {
            const style = document.createElement('style');
            style.id = 'documentVaultStyles';
            style.textContent = `
                .vault-card {
                    background: var(--bg-surface);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .vault-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                    border-color: var(--accent-subtle);
                }
                .doc-item-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    transition: all 0.2s ease;
                }
                .doc-item-card:hover {
                    border-color: var(--accent-primary);
                }
                .progress-ring {
                    width: 48px;
                    height: 48px;
                }
                .progress-ring-circle {
                    transition: stroke-dashoffset 0.35s;
                    transform: rotate(-90deg);
                    transform-origin: 50% 50%;
                }
                .deadline-urgent {
                    color: var(--status-danger);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.2s;
                }
                .modal-overlay.active {
                    opacity: 1; pointer-events: all;
                }
                .modal-content {
                    background: var(--bg-surface); border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg); padding: 24px; width: 90%; max-width: 500px;
                    transform: scale(0.95); transition: transform 0.2s;
                }
                .modal-overlay.active .modal-content {
                    transform: scale(1);
                }
                /* Verification Pipeline Styles */
                .verification-pipeline {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    margin: 40px 0;
                    padding: 0 20px;
                }
                .pipeline-line {
                    position: absolute;
                    top: 24px;
                    left: 60px;
                    right: 60px;
                    height: 4px;
                    background: var(--bg-elevated);
                    z-index: 0;
                }
                .pipeline-step {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    width: 120px;
                    text-align: center;
                }
                .pipeline-circle {
                    width: 52px;
                    height: 52px;
                    background: var(--bg-surface);
                    border: 3px solid var(--border-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    transition: all 0.3s ease;
                }
                .pipeline-step:hover .pipeline-circle {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
                }
                .pipeline-step h4 {
                    font-size: 0.9rem;
                    color: var(--text-primary);
                }
                .pipeline-step p {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
            `;
            document.head.appendChild(style);
        }
    }

    getDefaultDocuments() {
        return [
            {
                category: 'Identity & Family Records',
                icon: '🪪',
                items: [
                    { id: 'cnic_' + Date.now(), name: 'CNIC / B-Form', description: 'Computerized National Identity Card or B-Form', required: true, checked: false, status: 'Original Available', notes: 'Attested by BISE Lahore', deadline: '', fileData: null, fileName: '' },
                    { id: 'frc_' + Date.now(), name: 'NADRA FRC Certificate', description: 'Family Registration Certificate for scholarship verification', required: true, checked: false, status: 'Digital Copy Ready', notes: '', deadline: '', fileData: null, fileName: '' }
                ]
            },
            {
                category: 'Academic Credentials',
                icon: '📚',
                items: [
                    { id: 'matric_' + Date.now(), name: 'Matric / SSC Certificate', description: 'Board result card and diploma', required: true, checked: false, status: 'Original Available', notes: '', deadline: '', fileData: null, fileName: '' },
                    { id: 'inter_' + Date.now(), name: 'Intermediate / HSSC Certificate', description: 'FSc / ICS / FA / A-Level result card', required: true, checked: false, status: 'Attestation Pending', notes: 'Pending IBCC verification', deadline: '', fileData: null, fileName: '' }
                ]
            }
        ];
    }

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) return JSON.parse(stored);
        } catch (e) { console.error('Storage parse error'); }
        return this.getDefaultDocuments();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.documents));
        } catch (e) {
            if(window.showToast) window.showToast('Storage Limit Exceeded! Could not save large file.', 'warning');
        }
    }

    getProgress() {
        let total = 0, checked = 0;
        this.documents.forEach(cat => {
            cat.items.forEach(item => {
                total++;
                if (item.checked) checked++;
            });
        });
        return { total, checked, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
    }

    addDocument(categoryName, name, description, deadline) {
        let category = this.documents.find(c => c.category === categoryName);
        if (!category) {
            category = { category: categoryName, icon: '📄', items: [] };
            this.documents.push(category);
        }
        category.items.push({
            id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: name,
            description: description,
            required: false,
            checked: false,
            status: 'Pending',
            notes: '',
            deadline: deadline,
            fileData: null,
            fileName: ''
        });
        this.save();
        this.render('documentsContainer');
        if(window.showToast) window.showToast('Document added successfully!', 'success');
    }

    toggleItem(itemId) {
        this.documents.forEach(cat => {
            cat.items.forEach(item => {
                if (item.id === itemId) item.checked = !item.checked;
            });
        });
        this.save();
        this.render('documentsContainer');
    }

    updateStatus(itemId, newStatus) {
        this.documents.forEach(cat => {
            cat.items.forEach(item => {
                if (item.id === itemId) item.status = newStatus;
            });
        });
        this.save();
        this.render('documentsContainer');
    }

    handleFileUpload(itemId, fileInput) {
        const file = fileInput.files[0];
        if (!file) return;
        if (file.size > 1.5 * 1024 * 1024) {
            if(window.showToast) window.showToast('File too large for prototype (Max 1.5MB).', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.documents.forEach(cat => {
                cat.items.forEach(item => {
                    if (item.id === itemId) {
                        item.fileData = e.target.result;
                        item.fileName = file.name;
                        item.status = 'Digital Uploaded';
                        item.checked = true;
                    }
                });
            });
            this.save();
            this.render('documentsContainer');
            if(window.showToast) window.showToast('File uploaded to vault!', 'success');
        };
        reader.readAsDataURL(file);
    }

    removeFile(itemId) {
        if(!confirm('Are you sure you want to delete this file?')) return;
        this.documents.forEach(cat => {
            cat.items.forEach(item => {
                if (item.id === itemId) {
                    item.fileData = null;
                    item.fileName = '';
                }
            });
        });
        this.save();
        this.render('documentsContainer');
    }

    deleteDocument(itemId) {
        if(!confirm('Delete this document entry entirely?')) return;
        this.documents.forEach(cat => {
            cat.items = cat.items.filter(item => item.id !== itemId);
        });
        this.documents = this.documents.filter(cat => cat.items.length > 0);
        this.save();
        this.render('documentsContainer');
    }

    checkDeadlineStatus(dateString) {
        if (!dateString) return '';
        const target = new Date(dateString);
        const today = new Date();
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return `<span class="deadline-urgent">⚠️ Overdue by ${Math.abs(diffDays)} days</span>`;
        if (diffDays <= 7) return `<span class="deadline-urgent">⏰ Due in ${diffDays} days</span>`;
        return `<span style="color:var(--text-secondary); font-size:0.8rem;">📅 Due: ${dateString}</span>`;
    }

    static switchSubTab(tab) {
        if (window.docChecklistInstance) {
            window.docChecklistInstance.currentTab = tab;
            window.docChecklistInstance.render('documentsContainer');
        }
    }

    render(containerId = 'documentsContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const p = this.getProgress();
        const catOptions = this.documents.map(c => `<option value="${c.category}">${c.category}</option>`).join('');

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:24px;">
                <!-- Header & Sub-Nav Tabs -->
                <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
                    <div>
                        <h2 style="font-family:var(--font-display); font-size:1.5rem; margin-bottom:8px;">📂 Document Central</h2>
                        <p style="font-size:0.9rem; color:var(--text-secondary); max-width:600px;">Organize your digital vault and navigate the complex Pakistani document attestation process seamlessly.</p>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button class="btn ${this.currentTab === 'vault' ? 'btn-primary' : 'btn-secondary'}" onclick="DocumentChecklist.switchSubTab('vault')">💼 Digital Vault</button>
                        <button class="btn ${this.currentTab === 'verification' ? 'btn-primary' : 'btn-secondary'}" onclick="DocumentChecklist.switchSubTab('verification')">🛡️ Verification Hub</button>
                    </div>
                </div>

                <!-- DIGITAL VAULT TAB -->
                <div id="docLockerView" style="display: ${this.currentTab === 'vault' ? 'block' : 'none'};">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
                        <div style="display:flex; align-items:center; gap:20px;">
                            <div style="text-align:right;">
                                <div style="font-size:1.2rem; font-weight:700; color:var(--accent-primary);">${p.checked} / ${p.total}</div>
                                <div style="font-size:0.8rem; color:var(--text-tertiary);">Ready Documents</div>
                            </div>
                            <svg class="progress-ring" width="48" height="48">
                                <circle stroke="var(--bg-elevated)" stroke-width="4" fill="transparent" r="20" cx="24" cy="24"/>
                                <circle class="progress-ring-circle" stroke="var(--accent-primary)" stroke-width="4" stroke-dasharray="${20 * 2 * Math.PI}" stroke-dashoffset="${(20 * 2 * Math.PI) - ((p.percentage / 100) * (20 * 2 * Math.PI))}" stroke-linecap="round" fill="transparent" r="20" cx="24" cy="24"/>
                            </svg>
                        </div>
                        <button class="btn btn-primary" onclick="DocumentChecklist.openModal()">+ Add Document</button>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:20px;">
                        ${this.documents.map(cat => `
                            <div class="vault-card">
                                <h3 style="font-size:1.1rem; font-family:var(--font-display); margin-bottom:16px; color:var(--text-primary); border-bottom:1px solid var(--border-color); padding-bottom:8px;">${cat.icon} ${cat.category}</h3>
                                <div style="display:flex; flex-direction:column; gap:12px;">
                                    ${cat.items.map(item => `
                                        <div class="doc-item-card ${item.checked ? 'completed' : ''}" style="${item.checked ? 'border-color:var(--status-success); background:rgba(34,197,94,0.03);' : ''}">
                                            
                                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                                <div style="display:flex; gap:12px;">
                                                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="window.docChecklistInstance.toggleItem('${item.id}')" style="margin-top:2px; accent-color:var(--status-success); width:18px; height:18px; cursor:pointer;">
                                                    <div>
                                                        <h4 style="font-size:0.95rem; color:var(--text-primary); font-weight:600; margin-bottom:2px;">${item.name}</h4>
                                                        <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4;">${item.description}</p>
                                                        ${item.deadline ? `<div style="margin-top:6px;">${this.checkDeadlineStatus(item.deadline)}</div>` : ''}
                                                    </div>
                                                </div>
                                                <button class="btn btn-sm" style="background:transparent; color:var(--text-tertiary); padding:4px;" onclick="window.docChecklistInstance.deleteDocument('${item.id}')" title="Delete">🗑️</button>
                                            </div>

                                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--border-subtle); padding-top:10px; margin-top:4px;">
                                                <select style="background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:4px 8px; font-size:0.75rem; cursor:pointer;" onchange="window.docChecklistInstance.updateStatus('${item.id}', this.value)">
                                                    <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                                    <option value="Attestation Pending" ${item.status === 'Attestation Pending' ? 'selected' : ''}>Attestation Pending</option>
                                                    <option value="Original Available" ${item.status === 'Original Available' ? 'selected' : ''}>Original Available</option>
                                                    <option value="Digital Uploaded" ${item.status === 'Digital Uploaded' ? 'selected' : ''}>Digital Uploaded</option>
                                                </select>

                                                <div>
                                                    ${item.fileData 
                                                        ? `<div style="display:flex; align-items:center; gap:8px;">
                                                             <a href="${item.fileData}" download="${item.fileName}" style="font-size:0.75rem; color:var(--accent-primary); text-decoration:none;">📄 ${item.fileName.length > 15 ? item.fileName.substring(0,12)+'...' : item.fileName}</a>
                                                             <button style="background:none; border:none; color:var(--status-danger); cursor:pointer; font-size:0.8rem;" onclick="window.docChecklistInstance.removeFile('${item.id}')">✕</button>
                                                           </div>`
                                                        : `<label style="background:var(--accent-subtle); color:var(--accent-primary); padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                                                             <input type="file" style="display:none;" accept=".pdf, image/*" onchange="window.docChecklistInstance.handleFileUpload('${item.id}', this)">
                                                             ⬆ Upload
                                                           </label>`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- VERIFICATION HUB TAB -->
                <div id="docVerificationView" style="display: ${this.currentTab === 'verification' ? 'block' : 'none'};">
                    <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-color); margin-bottom:24px;">
                        <h3 style="font-family:var(--font-display); font-size:1.2rem; margin-bottom:12px; color:var(--text-primary);">📍 The Master Attestation Pipeline</h3>
                        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:24px;">Follow this exact sequence for document verification. You cannot skip steps (e.g. HEC requires IBCC verified documents).</p>
                        
                        <div class="verification-pipeline">
                            <div class="pipeline-line"></div>
                            <div class="pipeline-step">
                                <div class="pipeline-circle">1</div>
                                <h4>Local Board</h4>
                                <p>Get verified sealed envelope of SSC/HSSC.</p>
                            </div>
                            <div class="pipeline-step">
                                <div class="pipeline-circle">2</div>
                                <h4>IBCC</h4>
                                <p>Submit board envelope for IBCC attestation.</p>
                                <a href="https://ibcc.edu.pk" target="_blank" class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:0.7rem; margin-top:4px;">Portal ↗</a>
                            </div>
                            <div class="pipeline-step">
                                <div class="pipeline-circle">3</div>
                                <h4>HEC</h4>
                                <p>Verify University Degrees (Undergrad/Grad).</p>
                                <a href="https://hec.gov.pk" target="_blank" class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:0.7rem; margin-top:4px;">E-Portal ↗</a>
                            </div>
                            <div class="pipeline-step">
                                <div class="pipeline-circle">4</div>
                                <h4>MOFA</h4>
                                <p>Final stamp for study abroad / visas.</p>
                            </div>
                        </div>
                    </div>

                    <h3 style="font-family:var(--font-display); font-size:1.2rem; margin-bottom:16px; color:var(--text-primary);">📖 Procedural Verification Guides</h3>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
                        
                        <div class="vault-card">
                            <h4 style="color:var(--accent-primary); font-size:1.1rem; font-family:var(--font-display); margin-bottom:10px;">⚖️ True Copies & Notary</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">Notarized copies & Rs. 100-500 stamp paper income affidavits.</p>
                            <ul style="font-size:0.8rem; color:var(--text-primary); padding-left:18px; display:flex; flex-direction:column; gap:8px;">
                                <li>Visit Oath Commissioner at local court district.</li>
                                <li>Affix notary seal & red adhesive stamp on photocopies.</li>
                                <li>Income affidavits must specify monthly household earnings.</li>
                            </ul>
                        </div>

                        <div class="vault-card">
                            <h4 style="color:var(--accent-primary); font-size:1.1rem; font-family:var(--font-display); margin-bottom:10px;">🎓 Hope Certificates</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">Official principal letter for ongoing HSSC-Part 2 candidates.</p>
                            <ul style="font-size:0.8rem; color:var(--text-primary); padding-left:18px; display:flex; flex-direction:column; gap:8px;">
                                <li>Must be on official college letterhead.</li>
                                <li>Specifies expected score percentage (e.g. 80%+).</li>
                                <li>Signed and stamped by Principal / Headmaster.</li>
                            </ul>
                        </div>

                        <div class="vault-card">
                            <h4 style="color:var(--accent-primary); font-size:1.1rem; font-family:var(--font-display); margin-bottom:10px;">👨‍👩‍👧‍👦 NADRA CNIC & FRC</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">Family Registration Certificate for need-based scholarships.</p>
                            <ul style="font-size:0.8rem; color:var(--text-primary); padding-left:18px; display:flex; flex-direction:column; gap:8px;">
                                <li>Apply online via <em>NADRA Pak-ID App</em>.</li>
                                <li>Select FRC with Parents & Siblings hierarchy.</li>
                                <li>Issued in digital PDF format within 24-48 hours.</li>
                            </ul>
                        </div>

                        <div class="vault-card">
                            <h4 style="color:var(--accent-primary); font-size:1.1rem; font-family:var(--font-display); margin-bottom:10px;">🗜️ Portal Upload Formatting</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">Compressing files under 500 KB for university portals.</p>
                            <ul style="font-size:0.8rem; color:var(--text-primary); padding-left:18px; display:flex; flex-direction:column; gap:8px;">
                                <li>Use 300 DPI scan settings for original certificates.</li>
                                <li>Compress PDFs via ilovepdf / Adobe online tool.</li>
                                <li>Passport photo size: 35mm x 45mm, JPEG < 200 KB.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Document Modal -->
            <div class="modal-overlay" id="addDocModal">
                <div class="modal-content">
                    <h3 style="font-family:var(--font-display); font-size:1.2rem; margin-bottom:16px;">Add New Document</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Document Name</label>
                            <input type="text" id="newDocName" class="form-input" placeholder="e.g. Recommendation Letter" style="width:100%;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Description</label>
                            <input type="text" id="newDocDesc" class="form-input" placeholder="e.g. From Principal for USAT" style="width:100%;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Category</label>
                            <select id="newDocCategory" class="form-input" style="width:100%;">
                                ${catOptions}
                                <option value="Custom">-- Add New Category --</option>
                            </select>
                        </div>
                        <div id="newCatDiv" style="display:none;">
                            <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">New Category Name</label>
                            <input type="text" id="newDocCustomCat" class="form-input" placeholder="e.g. Extracurriculars" style="width:100%;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Target Deadline (Optional)</label>
                            <input type="date" id="newDocDeadline" class="form-input" style="width:100%;">
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                        <button class="btn" style="background:var(--bg-elevated); color:var(--text-primary);" onclick="DocumentChecklist.closeModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="DocumentChecklist.submitNewDoc()">Save Document</button>
                    </div>
                </div>
            </div>
        `;

        const catSelect = document.getElementById('newDocCategory');
        if (catSelect) {
            catSelect.addEventListener('change', (e) => {
                document.getElementById('newCatDiv').style.display = e.target.value === 'Custom' ? 'block' : 'none';
            });
        }
    }

    static openModal() {
        document.getElementById('addDocModal')?.classList.add('active');
    }

    static closeModal() {
        document.getElementById('addDocModal')?.classList.remove('active');
    }

    static submitNewDoc() {
        const name = document.getElementById('newDocName').value.trim();
        const desc = document.getElementById('newDocDesc').value.trim();
        let cat = document.getElementById('newDocCategory').value;
        if (cat === 'Custom') cat = document.getElementById('newDocCustomCat').value.trim();
        const deadline = document.getElementById('newDocDeadline').value;

        if (!name || !cat) {
            if(window.showToast) window.showToast('Name and Category are required!', 'warning');
            return;
        }

        window.docChecklistInstance.addDocument(cat, name, desc, deadline);
        DocumentChecklist.closeModal();
    }
}

// Global instance
window.docChecklistInstance = new DocumentChecklist();
