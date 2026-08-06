/**
 * ScholarPath AI — SOP & Essay Editor (Pro)
 * Advanced editor for personal statements and motivation letters with Multi-Essay Support
 * Integrated with Matchmaker Profile Data
 */

class SOPEditor {
    constructor() {
        this.storageKey = 'scholarpath_sops_v2';
        this.essays = this.load();
        this.currentEssayId = null;
        this.viewMode = 'dashboard'; // 'dashboard' or 'editor'
        this.saveTimeout = null;
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('sop-pro-styles')) return;
        const style = document.createElement('style');
        style.id = 'sop-pro-styles';
        style.innerHTML = `
            .sop-app-container {
                display: flex;
                flex-direction: column;
                gap: 24px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .sop-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
            .sop-card-add {
                background: linear-gradient(135deg, rgba(var(--accent-rgb, 79,70,229), 0.1) 0%, rgba(var(--accent-rgb, 79,70,229), 0.05) 100%);
                border: 2px dashed rgba(var(--accent-rgb, 79,70,229), 0.4);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 180px;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                color: var(--accent-primary, #4f46e5);
            }
            .sop-card-add:hover {
                transform: translateY(-4px);
                background: linear-gradient(135deg, rgba(var(--accent-rgb, 79,70,229), 0.15) 0%, rgba(var(--accent-rgb, 79,70,229), 0.08) 100%);
                border-style: solid;
                box-shadow: 0 10px 25px rgba(var(--accent-rgb, 79,70,229), 0.15);
            }
            .sop-card-essay {
                background: var(--bg-surface, #ffffff);
                border: 1px solid var(--border-color, #eaeaea);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                min-height: 180px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            .sop-card-essay:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                border-color: rgba(var(--accent-rgb, 79,70,229), 0.3);
            }
            .sop-card-essay::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; height: 4px;
                background: linear-gradient(90deg, var(--accent-primary, #4f46e5), #a855f7);
                opacity: 0;
                transition: opacity 0.2s;
            }
            .sop-card-essay:hover::before {
                opacity: 1;
            }
            .sop-card-delete {
                position: absolute;
                bottom: 16px; right: 16px;
                color: var(--text-tertiary, #9ca3af);
                background: transparent; border: none; cursor: pointer;
                padding: 6px; border-radius: 8px;
                transition: all 0.2s;
            }
            .sop-card-delete:hover {
                background: rgba(239, 68, 68, 0.1);
                color: var(--status-danger, #ef4444);
            }
            /* Editor specific styles */
            .sop-editor-layout {
                display: flex;
                flex-direction: column;
                gap: 20px;
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            .sop-settings-bar {
                background: var(--bg-surface, #ffffff);
                padding: 20px;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                border: 1px solid var(--border-color, #eaeaea);
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
                align-items: center;
            }
            .sop-input-group {
                flex: 1;
                min-width: 200px;
            }
            .sop-input-label {
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--text-secondary, #6b7280);
                margin-bottom: 6px;
                display: block;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .sop-input {
                width: 100%;
                padding: 10px 14px;
                border-radius: 8px;
                border: 1px solid var(--border-color, #eaeaea);
                background: var(--bg-elevated, #f9fafb);
                font-size: 0.95rem;
                transition: all 0.2s ease;
                color: var(--text-primary, #111827);
            }
            .sop-input:focus {
                outline: none;
                border-color: var(--accent-primary, #4f46e5);
                box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 79, 70, 229), 0.15);
                background: var(--bg-surface, #ffffff);
            }
            .sop-profile-select-btn {
                width: 100%;
                padding: 8px 12px;
                border-radius: 10px;
                border: 1px solid var(--border-color, #eaeaea);
                background: var(--bg-elevated, #f9fafb);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-primary, #111827);
            }
            .sop-profile-select-btn:hover {
                border-color: var(--accent-primary, #4f46e5);
                background: var(--bg-surface, #ffffff);
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
            }
            .sop-profile-avatar-badge {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--accent-primary, #4f46e5), #a855f7);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.8rem;
                flex-shrink: 0;
            }
            .sop-profile-dropdown-menu {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 0;
                z-index: 100;
                background: var(--bg-surface, #ffffff);
                border: 1px solid var(--border-color, #eaeaea);
                border-radius: 14px;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                max-height: 320px;
                overflow-y: auto;
                padding: 8px;
                animation: sopSlideDown 0.2s ease;
            }
            @keyframes sopSlideDown {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .sop-profile-item {
                padding: 10px 12px;
                border-radius: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s ease;
                margin-bottom: 4px;
            }
            .sop-profile-item:hover {
                background: var(--bg-elevated, #f3f4f6);
            }
            .sop-profile-item.active {
                background: rgba(var(--accent-rgb, 79, 70, 229), 0.1);
                border: 1px solid rgba(var(--accent-rgb, 79, 70, 229), 0.2);
            }
            .sop-editor-card {
                background: var(--bg-surface, #ffffff);
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                border: 1px solid var(--border-color, #eaeaea);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .sop-action-bar {
                padding: 16px 20px;
                background: var(--bg-elevated, #f8f9fa);
                border-bottom: 1px solid var(--border-color, #eaeaea);
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                align-items: center;
            }
            .sop-btn {
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 6px;
                border: none;
            }
            .sop-btn-primary {
                background: var(--accent-primary, #4f46e5);
                color: white;
                box-shadow: 0 4px 12px rgba(var(--accent-rgb, 79, 70, 229), 0.3);
            }
            .sop-btn-primary:hover {
                background: var(--accent-hover, #4338ca);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(var(--accent-rgb, 79, 70, 229), 0.4);
            }
            .sop-btn-secondary {
                background: white;
                color: var(--text-primary, #374151);
                border: 1px solid var(--border-color, #d1d5db);
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            }
            .sop-btn-secondary:hover {
                background: var(--bg-elevated, #f3f4f6);
                border-color: var(--text-secondary, #9ca3af);
                transform: translateY(-1px);
            }
            .sop-btn-outline {
                background: transparent;
                color: var(--accent-primary, #4f46e5);
                border: 1px dashed var(--accent-primary, #4f46e5);
            }
            .sop-btn-outline:hover {
                background: rgba(var(--accent-rgb, 79, 70, 229), 0.05);
            }
            .sop-toolbar {
                padding: 12px 20px;
                border-bottom: 1px solid var(--border-color, #eaeaea);
                display: flex;
                gap: 8px;
                align-items: center;
                background: white;
            }
            .sop-toolbar-btn {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 1px solid transparent;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary, #6b7280);
                transition: all 0.2s;
            }
            .sop-toolbar-btn:hover {
                background: var(--bg-elevated, #f3f4f6);
                color: var(--text-primary, #111827);
            }
            .sop-editor-content {
                padding: 40px 60px;
                min-height: 500px;
                outline: none;
                font-size: 1.05rem;
                line-height: 1.8;
                color: var(--text-primary, #1f2937);
                background: white;
                font-family: 'Merriweather', 'Georgia', serif;
            }
            .sop-editor-content p { margin-bottom: 1.5em; }
            @media (max-width: 768px) {
                .sop-editor-content { padding: 24px; }
            }
            .sop-pro-badge {
                font-size: 0.65rem;
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
                color: white;
                padding: 3px 8px;
                border-radius: 12px;
                font-weight: 800;
                letter-spacing: 0.5px;
            }
        `;
        document.head.appendChild(style);
    }

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        
        try {
            const legacy = localStorage.getItem('scholarpath_sop');
            if (legacy && legacy.trim() !== '') {
                return [{
                    id: Date.now().toString(),
                    title: 'My First SOP',
                    context: '',
                    wordLimit: '',
                    content: legacy,
                    updatedAt: Date.now()
                }];
            }
        } catch (e) {}
        return [];
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.essays));
    }

    addNewEssay() {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('SOP Editor', false)) {
            return;
        }
        const id = Date.now().toString();
        this.essays.unshift({
            id: id,
            title: 'Untitled Draft',
            context: '',
            wordLimit: '',
            content: '<p><br></p>',
            updatedAt: Date.now()
        });
        this.currentEssayId = id;
        this.viewMode = 'editor';
        this.saveToStorage();
        this.render(this.containerId);
    }

    selectEssay(id) {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('SOP Editor', false)) {
            return;
        }
        this.currentEssayId = id;
        this.viewMode = 'editor';
        this.render(this.containerId);
    }
    
    backToDashboard() {
        this.viewMode = 'dashboard';
        this.currentEssayId = null;
        this.render(this.containerId);
    }

    deleteEssay(id, e) {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this essay draft?")) {
            this.essays = this.essays.filter(essay => essay.id !== id);
            this.saveToStorage();
            this.render(this.containerId);
        }
    }

    getCurrentEssay() {
        return this.essays.find(e => e.id === this.currentEssayId);
    }

    getWordCount(html) {
        const text = (html || '').replace(/<[^>]*>?/gm, ' ').trim();
        return text ? text.split(/\s+/).length : 0;
    }
    
    getProfileData() {
        // Grab data saved from the Matchmaker inputs
        return {
            hssc: localStorage.getItem('mm_hssc') || 'Not specified',
            ssc: localStorage.getItem('mm_ssc') || 'Not specified',
            stream: localStorage.getItem('mm_stream') || 'General',
            income: localStorage.getItem('mm_income') || 'Not specified'
        };
    }

    getProfilesMap() {
        try {
            const stored = localStorage.getItem('scholarpath_profiles_v2');
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        return {};
    }

    toggleProfileDropdown(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('sop-profile-dropdown-menu');
        const chevron = document.getElementById('sop-profile-chevron');
        if (!menu) return;
        
        const isHidden = menu.style.display === 'none' || !menu.style.display;
        menu.style.display = isHidden ? 'block' : 'none';
        if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        
        if (isHidden) {
            const closeHandler = (event) => {
                if (!event.target.closest('#sop-profile-dropdown-btn') && !event.target.closest('#sop-profile-dropdown-menu')) {
                    menu.style.display = 'none';
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                    document.removeEventListener('click', closeHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeHandler), 10);
        }
    }

    selectProfile(id, e) {
        if (e) e.stopPropagation();
        const essay = this.getCurrentEssay();
        if (essay) {
            essay.profileId = id;
            this.saveToStorage();
        }
        const menu = document.getElementById('sop-profile-dropdown-menu');
        if (menu) menu.style.display = 'none';
        this.render(this.containerId);
    }

    buildProfileContext(p) {
        if (!p) {
            const hssc = localStorage.getItem('mm_hssc') || 'N/A';
            const ssc = localStorage.getItem('mm_ssc') || 'N/A';
            const stream = localStorage.getItem('mm_stream') || 'General';
            return `Academic Background: ${stream}\nHSSC Marks: ${hssc}\nSSC Marks: ${ssc}`;
        }

        let ctx = `Candidate Name: ${p.firstName || ''} ${p.lastName || ''}\n`;
        ctx += `Demographics: ${p.gender || 'N/A'}, Nationality: ${p.nationality || 'N/A'}, City: ${p.city || 'N/A'}\n\n`;
        
        ctx += `--- EDUCATION & ACADEMIC BACKGROUND ---\n`;
        if (p.educationList && p.educationList.length > 0) {
            p.educationList.forEach(e => {
                ctx += `- Level/Degree: ${e.degree || e.level} at ${e.institution || 'N/A'} (${e.startYear || ''}-${e.endYear || ''}). Score/GPA: ${e.score || 'N/A'}/${e.totalScore || 'N/A'}\n`;
            });
        } else {
            ctx += `No formal education history added.\n`;
        }

        ctx += `\n--- WORK & PROFESSIONAL EXPERIENCE ---\n`;
        if (p.experienceList && p.experienceList.length > 0) {
            p.experienceList.forEach(e => {
                ctx += `- Role: ${e.role} at ${e.company} (${e.startYear}-${e.endYear || 'Present'})\n`;
            });
        } else {
            ctx += `No work experience listed.\n`;
        }

        ctx += `\n--- SKILLS, MOTIVATIONS & ACHIEVEMENTS ---\n`;
        ctx += `Mother Tongue: ${p.motherTongue || 'N/A'}\n`;
        if (p.otherLanguages && p.otherLanguages.length > 0) {
            ctx += `Languages: ${p.otherLanguages.map(l => l.lang + ' (' + l.level + ')').join(', ')}\n`;
        }
        if (p.digitalSkills && p.digitalSkills.length > 0) ctx += `Technical/Digital Skills: ${p.digitalSkills.join(', ')}\n`;
        if (p.softSkills && p.softSkills.length > 0) ctx += `Soft Skills: ${p.softSkills.join(', ')}\n`;
        if (p.extracurriculars) ctx += `Extracurricular Activities & Leadership: ${p.extracurriculars}\n`;
        if (p.certifications) ctx += `Certifications & Honors: ${p.certifications}\n`;
        if (p.futureFieldOfStudy) ctx += `Intended Specialization / Target Field: ${p.futureFieldOfStudy}\n`;
        if (p.personalMotive) ctx += `Personal Career Goals & Motivation: ${p.personalMotive}\n`;

        return ctx;
    }

    render(containerId) {
        this.containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.viewMode === 'dashboard') {
            let cardsHtml = this.essays.map(essay => `
                <div class="sop-card-essay" onclick="window._sopEditor.selectEssay('${essay.id}')">
                    <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${essay.context || essay.title || 'Untitled Draft'}
                    </h3>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${essay.content.replace(/<[^>]*>?/gm, ' ') || 'No content yet...'}
                    </p>
                    <div style="flex: 1;"></div>
                    <div style="margin-top: 16px; font-size: 0.75rem; color: var(--text-tertiary); display: flex; justify-content: space-between; align-items: center;">
                        <span>${this.getWordCount(essay.content)} words</span>
                        <span>${new Date(essay.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <button class="sop-card-delete" onclick="window._sopEditor.deleteEssay('${essay.id}', event)" title="Delete">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `).join('');

            container.innerHTML = `
                <div style="margin-bottom: 32px;">
                    <h2 style="font-family: var(--font-display, 'Inter'); font-size: 1.8rem; font-weight: 800; color: var(--text-primary, #111827); letter-spacing: -0.5px; margin: 0 0 8px 0; display: flex; align-items: center;">
                        Statement of Purpose Editor 
                        <span class="sop-pro-badge" style="margin-left: 12px; font-size: 0.75rem; padding: 4px 10px;">PRO</span>
                    </h2>
                    <p style="color: var(--text-secondary, #6b7280); font-size: 0.95rem; margin: 0;">Create deeply personalized admissions essays tailored to your student profile.</p>
                </div>
                
                <div class="sop-app-container">
                    <div class="sop-grid">
                        <div class="sop-card-add" onclick="window._sopEditor.addNewEssay()">
                            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">Create New Essay</h3>
                        </div>
                        ${cardsHtml}
                    </div>
                </div>
            `;
        } 
        else if (this.viewMode === 'editor') {
            const activeEssay = this.getCurrentEssay();
            if (!activeEssay) {
                this.backToDashboard();
                return;
            }

            const profilesMap = this.getProfilesMap();
            const profileKeys = Object.keys(profilesMap);
            
            let selectedProfileId = activeEssay.profileId;
            if (!selectedProfileId && profileKeys.length > 0) {
                selectedProfileId = profileKeys[0];
            }

            let activeAvatarChar = '❓';
            let activeProfileTitle = 'No Profile Selected';
            let activeProfileSubtitle = 'Click to create a profile first';
            let profileListHtml = '';

            if (profileKeys.length === 0) {
                profileListHtml = `
                    <div style="padding: 20px 16px; text-align: center;">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">👤</div>
                        <h4 style="margin: 0 0 6px 0; font-size: 1rem; font-weight: 700; color: var(--text-primary);">No Profile Found</h4>
                        <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">Please create an academic profile first so AI can read your education history & skills to generate your SOP.</p>
                        <button type="button" class="sop-btn sop-btn-primary" style="width: 100%; justify-content: center; padding: 10px;" onclick="if(window.switchView) window.switchView('profile');">
                            ➕ Create a Profile First
                        </button>
                    </div>
                `;
            } else {
                const activeProf = profilesMap[selectedProfileId] || profilesMap[profileKeys[0]];
                if (activeProf) {
                    activeAvatarChar = (activeProf.firstName || activeProf.profileName || 'P').charAt(0).toUpperCase();
                    activeProfileTitle = activeProf.profileName || 'Academic Profile';
                    activeProfileSubtitle = `${activeProf.firstName || ''} ${activeProf.lastName || ''}`.trim() || 'Saved Candidate Profile';
                }

                profileListHtml = profileKeys.map(id => {
                    const prof = profilesMap[id];
                    const isSel = (selectedProfileId === id);
                    const initial = (prof.firstName || prof.profileName || 'P').charAt(0).toUpperCase();
                    const degreeOrField = (prof.educationList && prof.educationList.length > 0) ? prof.educationList[0].degree || prof.educationList[0].level : prof.futureFieldOfStudy || 'Academic Profile';
                    
                    return `
                        <div class="sop-profile-item ${isSel ? 'active' : ''}" onclick="window._sopEditor.selectProfile('${id}', event)">
                            <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                                <div class="sop-profile-avatar-badge">${initial}</div>
                                <div style="text-align: left; overflow: hidden;">
                                    <strong style="font-size: 0.88rem; display: block; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${prof.profileName || 'Profile'} (${prof.firstName || ''} ${prof.lastName || ''})</strong>
                                    <span style="font-size: 0.75rem; color: var(--text-tertiary); display: block;">${degreeOrField}</span>
                                </div>
                            </div>
                            ${isSel ? '<svg width="18" height="18" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                        </div>
                    `;
                }).join('') + `
                    <div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 6px;">
                        <button type="button" class="sop-btn sop-btn-secondary" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 8px;" onclick="if(window.switchView) window.switchView('profile');">
                            ➕ Create Another Profile
                        </button>
                    </div>
                `;
            }

            container.innerHTML = `
                <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
                    <button class="sop-btn sop-btn-secondary" style="padding: 8px 12px; font-size: 0.85rem;" onclick="window._sopEditor.backToDashboard()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Dashboard
                    </button>
                    <span id="sop-save-status-top" style="font-size: 0.85rem; color: var(--status-success, #10b981); font-weight: 600;">All changes saved</span>
                </div>
                
                <div class="sop-editor-layout">
                    <!-- Settings & Profile Bar -->
                    <div class="sop-settings-bar" style="display: flex; flex-direction: column; gap: 20px; padding: 24px;">
                        <!-- Symmetrical 3-Column Inputs Row -->
                        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; width: 100%;">
                            <div class="sop-input-group" style="position: relative;">
                                <label class="sop-input-label">👤 Candidate Profile</label>
                                <input type="hidden" id="sop-profile-select" value="${selectedProfileId || ''}">
                                
                                <button type="button" id="sop-profile-dropdown-btn" class="sop-profile-select-btn" onclick="window._sopEditor.toggleProfileDropdown(event)">
                                    <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; text-align: left;">
                                        <div class="sop-profile-avatar-badge">${activeAvatarChar}</div>
                                        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary); line-height: 1.2;">${activeProfileTitle}</div>
                                            <div style="font-size: 0.72rem; color: var(--text-tertiary); line-height: 1.2;">${activeProfileSubtitle}</div>
                                        </div>
                                    </div>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-left: 8px; transition: transform 0.2s;" id="sop-profile-chevron"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                <div id="sop-profile-dropdown-menu" class="sop-profile-dropdown-menu" style="display: none;">
                                    ${profileListHtml}
                                </div>
                            </div>
                            <div class="sop-input-group">
                                <label class="sop-input-label">🎯 Target University & Program</label>
                                <input type="text" id="sop-context" value="${activeEssay.context || ''}" placeholder="e.g., Stanford University MS Computer Science" class="sop-input" onchange="window._sopEditor.saveCurrentSettings()">
                            </div>
                            <div class="sop-input-group">
                                <label class="sop-input-label">📏 Word Count Limit</label>
                                <input type="text" id="sop-wordlimit" value="${activeEssay.wordLimit || ''}" placeholder="e.g., 500-1000 words (or No limit)" class="sop-input" onchange="window._sopEditor.saveCurrentSettings()">
                            </div>
                        </div>

                        <!-- Full Width Custom Instructions Row -->
                        <div class="sop-input-group" style="width: 100%;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <label class="sop-input-label" style="margin-bottom: 0;">✍️ Custom AI Instructions & Focus Areas</label>
                                <span style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 500;">Optional</span>
                            </div>
                            <textarea id="sop-instructions" class="sop-input" style="min-height: 70px; resize: vertical; font-family: inherit; line-height: 1.5;" 
                                placeholder="e.g., Focus heavily on my undergraduate research in AI, explain my 1-year career gap as self-directed learning, emphasize my leadership in student society..." 
                                onchange="window._sopEditor.saveCurrentSettings()">${activeEssay.instructions || ''}</textarea>
                        </div>
                    </div>
                    
                    <!-- Main Editor Container -->
                    <div class="sop-editor-card">
                        <!-- Action Bar -->
                        <div class="sop-action-bar">
                            <button class="sop-btn sop-btn-primary" onclick="window._sopEditor.draftEssay()">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Draft AI Essay (10 Credits)
                            </button>
                            <button class="sop-btn sop-btn-secondary" onclick="window._sopEditor.refineEssay()">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                Refine / Rewrite (10 Credits)
                            </button>
                            <button class="sop-btn sop-btn-secondary" onclick="window._sopEditor.checkMistakes()">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                Mistakes & Clichés (10 Credits)
                            </button>
                            <button class="sop-btn sop-btn-outline" onclick="window._sopEditor.humanizerComingSoon()">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                AI Humanizer <span class="sop-pro-badge">PRO</span>
                            </button>
                        </div>
                        
                        <!-- Formatting Toolbar -->
                        <div class="sop-toolbar">
                            <button class="sop-toolbar-btn" onclick="document.execCommand('bold', false, null)" title="Bold"><b>B</b></button>
                            <button class="sop-toolbar-btn" onclick="document.execCommand('italic', false, null)" title="Italic"><i>I</i></button>
                            <button class="sop-toolbar-btn" onclick="document.execCommand('underline', false, null)" title="Underline"><u>U</u></button>
                            <div style="width: 1px; height: 24px; background: var(--border-color, #eaeaea); margin: 0 8px;"></div>
                            <button class="sop-toolbar-btn" onclick="document.execCommand('insertUnorderedList', false, null)" title="Bullet List">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <div style="flex: 1;"></div>
                            <span style="font-size: 0.8rem; color: var(--text-tertiary, #9ca3af); margin-right: 16px; font-weight: 500;">
                                Words: <span id="sop-word-count" style="color: var(--text-primary, #111827);">${this.getWordCount(activeEssay.content)}</span>
                            </span>
                        </div>
                        
                        <!-- Editor Area -->
                        <div id="sop-editor-area" class="sop-editor-content" contenteditable="true" oninput="window._sopEditor.handleInput(event)">
                            ${activeEssay.content}
                        </div>
                    </div>
                    
                    <!-- Result Area -->
                    <div id="sop-analysis-result" style="padding: 24px; background: var(--bg-surface, #ffffff); border: 1px solid var(--accent-primary, #4f46e5); border-radius: 16px; box-shadow: 0 10px 25px rgba(var(--accent-rgb, 79,70,229), 0.1); font-size: 0.95rem; color: var(--text-primary, #111827); line-height: 1.7; display: none;">
                    </div>
                </div>
            `;
        }
        
        window._sopEditor = this;
    }

    saveCurrentSettings() {
        const essay = this.getCurrentEssay();
        if (!essay) return;
        
        const profileEl = document.getElementById('sop-profile-select');
        const contextEl = document.getElementById('sop-context');
        const limitEl = document.getElementById('sop-wordlimit');
        const instEl = document.getElementById('sop-instructions');
        
        if (profileEl) essay.profileId = profileEl.value;
        if (contextEl) essay.context = contextEl.value;
        if (limitEl) essay.wordLimit = limitEl.value;
        if (instEl) essay.instructions = instEl.value;
        essay.updatedAt = Date.now();
        
        this.saveToStorage();
    }

    handleInput(event) {
        const editor = event.target;
        const status = document.getElementById('sop-save-status-top');
        const wc = document.getElementById('sop-word-count');
        
        if (status) {
            status.textContent = 'Saving...';
            status.style.color = 'var(--text-tertiary, #9ca3af)';
        }
        
        if (wc) wc.textContent = this.getWordCount(editor.innerHTML);
        
        // Debounce save
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            const essay = this.getCurrentEssay();
            if (essay) {
                essay.content = editor.innerHTML;
                essay.updatedAt = Date.now();
                this.saveToStorage();
            }
            if (status) {
                status.textContent = 'All changes saved';
                status.style.color = 'var(--status-success, #10b981)';
            }
        }, 800);
    }

    humanizerComingSoon() {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('AI Humanizer', false)) {
            return;
        }
        if (window.showToast) {
            window.showToast('AI Humanizer is an upcoming PRO feature! Stay tuned.', 'info');
        } else {
            alert('AI Humanizer is an upcoming PRO feature! Stay tuned.');
        }
    }
    
    async callGemini(prompt, loadingMsg = "AI is thinking...") {
        const resultContainer = document.getElementById('sop-analysis-result');
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px;">
                <div class="loading-dots" style="margin-bottom: 16px;"><span></span><span></span><span></span></div>
                <p style="color: var(--accent-primary, #4f46e5); font-weight: 600; font-size: 1.1rem; margin: 0;">${loadingMsg}</p>
            </div>
        `;
        
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        try {
            const endpoint = `/api/sop/secure`;
            
            let headers = window.ScholarAuth ? await window.ScholarAuth.getAuthHeaders() : { 'Content-Type': 'application/json' };
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7 }
                })
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(()=>({}));
                const detail = (typeof errData.error === 'string') ? errData.error : (errData.error?.message || response.statusText);
                throw new Error(detail);
            }
            
            const data = await response.json();
            
            // Deduct credits locally so UI updates instantly and permanently
            if (window.ScholarAuth) window.ScholarAuth.deductLocalCredits(10);
            
            return data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
        } catch (err) {
            resultContainer.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px; color: var(--status-danger, #ef4444); padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 1rem;">API Request Failed</h4>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Please check your network connection or API quota limits.</p>
                        <code style="display: block; margin-top: 8px; font-size: 0.75rem; background: var(--bg-elevated); padding: 4px 8px; border-radius: 4px;">Error: ${err.message}</code>
                    </div>
                </div>`;
            console.error(err);
            return null;
        }
    }
    
    async draftEssay() {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('SOP AI Generator', true)) {
            return;
        }
        const essay = this.getCurrentEssay();
        if (!essay) return;
        
        this.saveCurrentSettings();
        
        if (!essay.context || essay.context.trim() === '') {
            alert("Please enter the Target University / Program / Organization to generate a contextual draft.");
            document.getElementById('sop-context')?.focus();
            return;
        }

        const confirmDraft = confirm("Drafting a new essay will overwrite the current content. Do you want to proceed?");
        if (!confirmDraft) return;
        
        const profilesMap = this.getProfilesMap();
        let selectedProfile = null;
        if (essay.profileId && profilesMap[essay.profileId]) {
            selectedProfile = profilesMap[essay.profileId];
        } else {
            const keys = Object.keys(profilesMap);
            if (keys.length > 0) selectedProfile = profilesMap[keys[0]];
        }
        
        const profileContextText = this.buildProfileContext(selectedProfile);
        
        const systemContext = "You are an elite Ivy League admissions consultant and master SOP strategist.";
        let prompt = `${systemContext}\n\n`;
        prompt += `Target Program / Institution: "${essay.context}"\n`;
        if (essay.wordLimit && essay.wordLimit.trim() !== '' && essay.wordLimit.toLowerCase() !== 'no limit') {
            prompt += `Word Limit Constraint: ${essay.wordLimit}\n`;
        }
        
        prompt += `\n### CANDIDATE PROFILE DATA ###\n${profileContextText}\n\n`;
        
        if (essay.instructions && essay.instructions.trim() !== '') {
            prompt += `### CANDIDATE'S SPECIFIC INSTRUCTIONS & FOCUS AREAS ###\n${essay.instructions}\n\n`;
        }
        
        prompt += `INSTRUCTIONS FOR WRITING THE ESSAY:
1. Deeply analyze the academic nature, prestige, and specific expectations of the target program ("${essay.context}"). Demonstrate why this candidate is a perfect academic and cultural fit.
2. Read the Candidate Profile Data carefully. Weave their exact education history, achievements, technical skills, and motives into a highly compelling, authentic narrative.
3. If the candidate provided Specific Instructions / Focus Areas above, strictly incorporate those specific points (e.g. key projects to highlight or gap explanations).
4. Maintain an intellectually rigorous, professional, and engaging tone with ZERO generic clichés.
5. Provide ONLY the final essay text, formatted cleanly in HTML paragraphs (<p>...</p>) without any markdown code wrappers or introductory text.`;
        
        const generatedHtml = await this.callGemini(prompt, "Analyzing program nature & writing custom SOP...");
        if (generatedHtml) {
            const editor = document.getElementById('sop-editor-area');
            const cleanHtml = generatedHtml.replace(/```html/g, '').replace(/```/g, '').trim();
            editor.innerHTML = cleanHtml;
            this.handleInput({ target: editor });
            
            document.getElementById('sop-analysis-result').innerHTML = `
                <div style="color: var(--status-success, #10b981); font-weight: 600; display: flex; align-items: center; gap: 12px; font-size: 1.05rem;">
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 50%;">✨</div> 
                    Tailored Statement of Purpose generated successfully based on candidate profile & custom instructions!
                </div>
            `;
        }
    }
    
    async refineEssay() {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('SOP Refine Studio', false)) {
            return;
        }
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const essay = this.getCurrentEssay();
        if (!essay) return;
        
        let targetText = selectedText;
        let isFullRewrite = false;
        
        if (!targetText) {
            const confirmFull = confirm("No text selected. Do you want to refine the entire essay?");
            if (!confirmFull) return;
            targetText = essay.content.replace(/<[^>]*>?/gm, '\n').trim();
            isFullRewrite = true;
            if (targetText.length < 50) return alert("Not enough text to refine. Please draft an essay first.");
        }
        
        const systemContext = "You are an elite academic editor and admission strategist.";
        let prompt = `${systemContext} Rewrite the following text to sound highly professional, compelling, and intellectually rigorous for a top-tier university admission or scholarship essay. Ensure perfect grammar while maintaining authentic voice. Provide ONLY the rewritten text, without any quotes or explanations.\n\nOriginal Text:\n${targetText}`;
        
        const result = await this.callGemini(prompt, isFullRewrite ? "Refining entire essay to perfection..." : "Refining selection...");
        
        if (result) {
            if (isFullRewrite) {
                const paragraphs = result.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
                document.getElementById('sop-editor-area').innerHTML = paragraphs;
                this.handleInput({ target: document.getElementById('sop-editor-area') });
            } else {
                document.execCommand('insertText', false, result.trim());
                this.handleInput({ target: document.getElementById('sop-editor-area') });
            }
            
            document.getElementById('sop-analysis-result').innerHTML = `
                <div style="color: var(--status-success, #10b981); font-weight: 600; display: flex; align-items: center; gap: 12px; font-size: 1.05rem;">
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 50%;">🔄</div> 
                    Text refined successfully!
                </div>`;
        }
    }
    
    async checkMistakes() {
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth('SOP Mistake Checker', false)) {
            return;
        }
        const essay = this.getCurrentEssay();
        if (!essay) return;
        
        const text = essay.content.replace(/<[^>]*>?/gm, ' ').trim();
        if (!text || text.length < 50) return alert("Please write at least 50 words to analyze for mistakes.");
        
        const systemContext = "You are a stringent scholarship selection committee member and strict grammar editor.";
        const prompt = `${systemContext} Critically analyze the following essay for any grammatical mistakes, overused clichés, generic statements, repetitive phrases, or weak vocabulary. Provide specific, stronger alternatives that stand out to admissions officers. Give exactly 3-5 highly actionable, bulleted points of constructive feedback.\n\nEssay:\n${text}`;
        
        const feedbackText = await this.callGemini(prompt, "Hunting for clichés & grammar mistakes...");
        if (feedbackText) this.displayResult("AI Mistake & Cliché Checker", feedbackText);
    }

    displayResult(title, markdown) {
        const htmlFeedback = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        document.getElementById('sop-analysis-result').innerHTML = `
            <div style="border-bottom: 1px solid var(--border-color, #eaeaea); padding-bottom: 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                <h4 style="color: var(--accent-primary, #4f46e5); margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ${title}
                </h4>
                <button class="sop-toolbar-btn" onclick="document.getElementById('sop-analysis-result').style.display='none'">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div style="color: var(--text-secondary, #4b5563); font-size: 0.95rem;">
                ${htmlFeedback}
            </div>
        `;
    }
}

window.SOPEditor = SOPEditor;
