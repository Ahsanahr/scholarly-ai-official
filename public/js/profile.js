/**
 * ScholarPath AI — Europass CV Builder
 * Advanced Wizard with Minimal Typing, Multi-Profile Dashboard, and Quick Navigation
 */

class StudentProfile {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            'welcome',
            'personal_names',
            'personal_contact',
            'personal_bio',
            'personal_location',
            'student_background',
            'education_details',
            'experience_check',
            'experience_details',
            'language_mother',
            'language_other',
            'skills_digital',
            'skills_soft',
            'future_goals',
            'extracurriculars',
            'certifications',
            'complete'
        ];

        this.initData();
        this.load();
    }

    initData() {
        // Predefined selection lists to minimize typing
        const universities = ['NUST Islamabad', 'FAST NUCES', 'LUMS Lahore', 'UET Lahore', 'COMSATS', 'PU Lahore', 'GIKI', 'IBA Karachi', 'NED Karachi', 'QAU Islamabad'];
        const boards = ['BISE Lahore', 'FBISE Federal', 'BISE Rawalpindi', 'BISE Faisalabad', 'BISE Karachi', 'Cambridge (CIE)', 'Aga Khan Board'];
        const degrees = ['BS Computer Science', 'BS Software Engineering', 'BBA', 'MBBS', 'BDS', 'BS Artificial Intelligence', 'BS Data Science', 'BS Electrical Engineering', 'MS Computer Science', 'MBA'];
        const streams = ['Pre-Engineering', 'Pre-Medical', 'ICS (Computer Science)', 'I.Com (Commerce)', 'General / Arts'];

        this.data = {
            nationalities: ['Pakistani', 'Indian', 'Bangladeshi', 'Afghan', 'Emirati', 'Saudi', 'British', 'American', 'Canadian', 'Australian'],
            cities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Dubai', 'London'],
            institutions: [...universities, ...boards],
            programs: [...degrees, ...streams],
            roles: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'Marketing Intern', 'Research Assistant', 'Graphic Designer', 'Content Writer', 'Sales Executive'],
            languages: ['Urdu', 'English', 'Punjabi', 'Pashto', 'Sindhi', 'Balochi', 'Arabic', 'Chinese', 'French', 'German'],
            digitalSkills: ['Python', 'JavaScript', 'C++', 'Java', 'React.js', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Git', 'Figma', 'Adobe Photoshop', 'MS Office', 'AutoCAD', 'MATLAB'],
            softSkills: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Time Management', 'Public Speaking', 'Critical Thinking', 'Adaptability', 'Project Management', 'Conflict Resolution']
        };
    }

    getDefault() {
        return {
            profileName: 'My Profile',
            firstName: '', lastName: '', email: '', phone: '',
            dob: '', gender: '', nationality: '', address: '', city: '',
            familyIncome: '', fatherOccupation: '', backgroundDetails: '',
            educationList: [], // Array of { level, institution, degree, startYear, endYear, score, totalScore }
            hasExperience: false,
            experienceList: [], // Array of { role, company, startYear, endYear }
            motherTongue: '',
            otherLanguages: [], // Array of { lang, level }
            digitalSkills: [],
            softSkills: [],
            futureFieldOfStudy: '',
            personalMotive: '',
            extracurriculars: '',
            certifications: '',
            savedAt: null
        };
    }

    load() {
        this.profiles = {};
        this.activeProfileId = null;
        this.profile = null;

        try {
            const storedNew = localStorage.getItem('scholarpath_profiles_v2');
            if (storedNew) {
                this.profiles = JSON.parse(storedNew);
            } else {
                // Backward compatibility migration from v1
                const storedOld = localStorage.getItem('europass_profile');
                if (storedOld) {
                    const parsed = JSON.parse(storedOld);
                    if (parsed.education && !parsed.educationList) {
                        parsed.educationList = parsed.education.institution ? [parsed.education] : [];
                    }
                    if (parsed.experience && !parsed.experienceList) {
                        parsed.experienceList = parsed.experience.role ? [parsed.experience] : [];
                    }
                    parsed.profileName = 'Imported Profile';
                    const id = Date.now().toString();
                    this.profiles[id] = { ...this.getDefault(), ...parsed, id };
                    this.saveToStorage();
                }
            }
        } catch (e) { }
    }

    saveToStorage() {
        localStorage.setItem('scholarpath_profiles_v2', JSON.stringify(this.profiles));
    }

    save() {
        if (this.activeProfileId && this.profile) {
            this.profile.savedAt = Date.now();
            this.profiles[this.activeProfileId] = this.profile;
            this.saveToStorage();
        }
    }

    getCompletionPercentage() {
        const totalSteps = this.steps.length - 2; // Exclude welcome and complete
        const currentProgress = Math.max(0, this.currentStep - 1);
        let pct = Math.round((currentProgress / totalSteps) * 100);
        return Math.min(Math.max(pct, 5), 100);
    }

    getValWithOther(selectId, otherId, fallbackVal = '') {
        const sel = document.getElementById(selectId);
        if (!sel) return fallbackVal;
        if (sel.value === 'Other') {
            return document.getElementById(otherId)?.value || fallbackVal;
        }
        return sel.value || fallbackVal;
    }

    extractEducation() {
        const level = document.getElementById('prof-edu-level')?.value;
        const institution = this.getValWithOther('prof-institution', 'prof-institution-other', '');
        const degree = this.getValWithOther('prof-degree', 'prof-degree-other', '');
        const startYear = document.getElementById('prof-edu-start')?.value || '';
        const endYear = document.getElementById('prof-edu-end')?.value || '';
        const score = document.getElementById('prof-edu-score')?.value || '';
        const totalScore = document.getElementById('prof-edu-total')?.value || '';

        if (institution || degree) {
            this.profile.educationList.push({ level, institution, degree, startYear, endYear, score, totalScore });
            return true;
        }
        return false;
    }

    uiAddEducation() {
        if (this.extractEducation()) {
            this.save();
            this.render('profileContainer', '');
        } else {
            alert('Please select or type an institution and degree.');
        }
    }

    removeEducation(index) {
        this.profile.educationList.splice(index, 1);
        this.save();
        this.render('profileContainer', '');
    }

    extractExperience() {
        const role = this.getValWithOther('prof-exp-role', 'prof-exp-role-other', '');
        const company = document.getElementById('prof-exp-company')?.value || '';
        const startYear = document.getElementById('prof-exp-start')?.value || '';
        const endYear = document.getElementById('prof-exp-end')?.value || '';

        if (role || company) {
            this.profile.experienceList.push({ role, company, startYear, endYear });
            return true;
        }
        return false;
    }

    uiAddExperience() {
        if (this.extractExperience()) {
            this.save();
            this.render('profileContainer', '');
        } else {
            alert('Please specify a role and company.');
        }
    }

    removeExperience(index) {
        this.profile.experienceList.splice(index, 1);
        this.save();
        this.render('profileContainer', '');
    }

    extractLanguage() {
        const lang = this.getValWithOther('prof-other-lang', 'prof-other-lang-other', '');
        const lvl = document.querySelector('.lang-lvl-btn.selected')?.dataset.val;
        if (lang && lvl) {
            const idx = this.profile.otherLanguages.findIndex(l => l.lang.toLowerCase() === lang.toLowerCase());
            if (idx > -1) {
                this.profile.otherLanguages[idx].level = lvl;
            } else {
                this.profile.otherLanguages.push({ lang, level: lvl });
            }
            return true;
        }
        return false;
    }

    uiAddLanguage() {
        if (this.extractLanguage()) {
            this.save();
            this.render('profileContainer', '');
        } else {
            alert('Please select a language and proficiency level.');
        }
    }

    removeLang(index) {
        this.profile.otherLanguages.splice(index, 1);
        this.save();
        this.render('profileContainer', '');
    }

    saveCurrentStepData() {
        if (!this.profile) return; // In welcome screen
        
        const step = this.steps[this.currentStep];
        const p = this.profile;

        if (step === 'personal_names') {
            p.firstName = document.getElementById('prof-fname')?.value || p.firstName;
            p.lastName = document.getElementById('prof-lname')?.value || p.lastName;
        } else if (step === 'personal_contact') {
            p.email = document.getElementById('prof-email')?.value || p.email;
            p.phone = document.getElementById('prof-phone')?.value || p.phone;
        } else if (step === 'personal_bio') {
            p.dob = document.getElementById('prof-dob')?.value || p.dob;
            p.gender = document.querySelector('.gender-btn.selected')?.dataset.val || p.gender;
        } else if (step === 'personal_location') {
            p.nationality = this.getValWithOther('prof-nationality', 'prof-nationality-other', p.nationality);
            p.city = this.getValWithOther('prof-city', 'prof-city-other', p.city);
            p.address = document.getElementById('prof-address')?.value || p.address;
        } else if (step === 'student_background') {
            p.familyIncome = document.getElementById('prof-income')?.value || p.familyIncome;
            p.fatherOccupation = document.getElementById('prof-father-occ')?.value || p.fatherOccupation;
            p.backgroundDetails = document.getElementById('prof-background-details')?.value || p.backgroundDetails;
        } else if (step === 'education_details') {
            this.extractEducation();
        } else if (step === 'experience_check') {
            p.hasExperience = document.querySelector('.exp-btn.selected')?.dataset.val === 'yes';
        } else if (step === 'experience_details') {
            this.extractExperience();
        } else if (step === 'language_mother') {
            p.motherTongue = this.getValWithOther('prof-mother-tongue', 'prof-mother-tongue-other', p.motherTongue);
        } else if (step === 'language_other') {
            this.extractLanguage();
        } else if (step === 'future_goals') {
            p.futureFieldOfStudy = document.getElementById('prof-future-field')?.value || p.futureFieldOfStudy;
            p.personalMotive = document.getElementById('prof-personal-motive')?.value || p.personalMotive;
        } else if (step === 'extracurriculars') {
            p.extracurriculars = document.getElementById('prof-extracurriculars')?.value || p.extracurriculars;
        } else if (step === 'certifications') {
            p.certifications = document.getElementById('prof-certs')?.value || p.certifications;
        }

        this.save();
    }

    nextStep() {
        this.saveCurrentStepData();

        let nextIndex = this.currentStep + 1;
        if (this.steps[this.currentStep] === 'experience_check' && !this.profile.hasExperience) {
            nextIndex++; // Skip experience_details
        }

        if (nextIndex < this.steps.length) {
            this.animateTransition('out-left', () => {
                this.currentStep = nextIndex;
                this.render('profileContainer', 'in-right');
            });
        }
    }

    prevStep() {
        let prevIndex = this.currentStep - 1;
        if (this.steps[this.currentStep] === 'language_mother' && !this.profile.hasExperience) {
            prevIndex--; // Skip experience_details going backwards
        }

        if (prevIndex >= 0) {
            this.animateTransition('out-right', () => {
                this.currentStep = prevIndex;
                this.render('profileContainer', 'in-left');
            });
        }
    }

    jumpToStep(index) {
        this.saveCurrentStepData();
        this.currentStep = parseInt(index);
        this.render('profileContainer', '');
    }

    saveAndExit() {
        this.saveCurrentStepData();
        this.currentStep = 0; // welcome dashboard
        this.activeProfileId = null;
        this.profile = null;
        this.render('profileContainer', 'in-left');
    }

    createNewProfile() {
        const name = prompt("Enter a name for this profile (e.g., 'Software Engineer CV'):", "My Profile");
        if (!name) return;
        const id = Date.now().toString();
        this.profiles[id] = { ...this.getDefault(), id, profileName: name };
        this.activeProfileId = id;
        this.profile = this.profiles[id];
        this.save();
        this.currentStep = 1; // personal_names
        this.render('profileContainer', 'in-right');
    }

    editProfile(id) {
        this.activeProfileId = id;
        this.profile = this.profiles[id];
        this.currentStep = 1; 
        this.render('profileContainer', 'in-right');
    }

    duplicateProfile(id) {
        const p = this.profiles[id];
        const newId = Date.now().toString();
        this.profiles[newId] = JSON.parse(JSON.stringify(p)); // deep copy
        this.profiles[newId].id = newId;
        this.profiles[newId].profileName = p.profileName + ' (Copy)';
        this.saveToStorage();
        this.render('profileContainer', '');
    }

    deleteProfile(id) {
        if(confirm('Are you sure you want to delete this profile?')) {
            delete this.profiles[id];
            this.saveToStorage();
            this.render('profileContainer', '');
        }
    }

    animateTransition(animationClass, callback) {
        const view = document.getElementById('cv-quiz-view');
        if (view) {
            view.className = `cv-quiz-view ${animationClass}`;
            setTimeout(callback, 300);
        } else {
            callback();
        }
    }

    selectBtn(btn, groupClass) {
        document.querySelectorAll('.' + groupClass).forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
    }

    toggleArrayItem(arrayName, item) {
        const arr = this.profile[arrayName];
        const idx = arr.indexOf(item);
        if (idx > -1) arr.splice(idx, 1);
        else arr.push(item);
        this.save();
        this.render('profileContainer', '');
    }

    genOptions(list, currentValue = '') {
        const isCustom = currentValue && !list.includes(currentValue);
        let html = list.map(item => `<option value="${item}" ${currentValue === item ? 'selected' : ''}>${item}</option>`).join('');
        html += `<option value="Other" ${isCustom ? 'selected' : ''}>Other...</option>`;
        return { html, isCustom };
    }

    handleOtherSelect(selectEl, otherId) {
        const otherInput = document.getElementById(otherId);
        if (otherInput) {
            if (selectEl.value === 'Other') {
                otherInput.style.display = 'block';
                otherInput.focus();
            } else {
                otherInput.style.display = 'none';
            }
        }
    }

    formatStepName(step) {
        return step.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    render(containerId, animationIn = 'in-right') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const p = this.profile;
        const completion = this.getCompletionPercentage();
        const stepName = this.steps[this.currentStep];

        const styles = `
            <style>
                .cv-quiz-container { max-width: 800px; margin: 0 auto; font-family: var(--font-body, 'Inter', sans-serif); color: var(--text-primary); }
                .cv-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 40px; box-shadow: var(--shadow-lg); overflow: hidden; min-height: 500px; display: flex; flex-direction: column; position: relative; }
                
                .cv-quiz-view { flex: 1; display: flex; flex-direction: column; }
                .cv-quiz-view.in-right { animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .cv-quiz-view.in-left { animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .cv-quiz-view.out-left { animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .cv-quiz-view.out-right { animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

                @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-40px); } }
                @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }

                .q-title { font-family: var(--font-display, 'Outfit', sans-serif); font-size: 2rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary); }
                .q-sub { color: var(--text-secondary); font-size: 1rem; margin-bottom: 30px; }

                .inp-group { margin-bottom: 20px; }
                .inp-label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
                .inp-box { width: 100%; background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 12px; padding: 14px 18px; font-size: 1.1rem; color: var(--text-primary); transition: all 0.2s; }
                .inp-box:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1); }
                textarea.inp-box { resize: vertical; min-height: 100px; }

                /* Selection Buttons */
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
                .sel-btn { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s; font-weight: 600; font-size: 1.1rem; color: var(--text-primary); }
                .sel-btn:hover { border-color: var(--text-tertiary); transform: translateY(-2px); }
                .sel-btn.selected { background: rgba(168, 85, 247, 0.1); border-color: var(--accent-primary); color: var(--accent-primary); box-shadow: 0 4px 15px rgba(168, 85, 247, 0.15); }

                /* Tags Cloud */
                .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
                .tag-item { background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 30px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
                .tag-item:hover { border-color: var(--text-tertiary); }
                .tag-item.active { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); }

                /* Progress */
                .prog-bar { height: 6px; background: var(--bg-elevated); border-radius: 10px; overflow: hidden; margin-bottom: 30px; }
                .prog-fill { height: 100%; background: var(--accent-primary); transition: width 0.4s ease; }

                /* Navigation */
                .q-nav { margin-top: auto; padding-top: 30px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); }
                .btn-primary { background: var(--accent-primary); color: #fff; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: transform 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.3); }
                .btn-secondary { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 14px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 1rem; }
                .btn-secondary:hover { background: var(--bg-elevated); color: var(--text-primary); }
                
                /* List Items */
                .list-card { display: flex; justify-content: space-between; padding: 15px; background: var(--bg-elevated); border: 1px solid var(--border-color); margin-bottom: 12px; border-radius: 12px; align-items: center; }
                .list-card-content { font-size: 1.05rem; }
                .list-card-meta { font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px; }
                
                /* Dashboard Enhancements */
                .prof-dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
                .prof-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s; }
                .prof-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
                .prof-card-info { flex: 1 1 200px; }
                .prof-card-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; flex: 1 1 340px; justify-content: flex-end; }
                .prof-card-actions > button { white-space: nowrap; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; gap: 6px; }
                .btn-del-profile { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; cursor: pointer; font-size: 1.2rem; padding: 8px 12px; border-radius: 10px; transition: all 0.2s; flex: 0 0 auto !important; }
                .btn-del-profile:hover { background: #ef4444; color: white; }
                @media (max-width: 600px) {
                    .prof-card-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
                    .prof-card-actions .btn-export-euro, .prof-card-actions .btn-export-pdf { grid-column: 1 / -1; }
                    .btn-del-profile { grid-column: 1 / -1; width: 100%; font-size: 1rem; padding: 12px; }
                }
            </style>
        `;

        let html = `
            ${styles}
            <div class="cv-quiz-container">
        `;

        // TOP NAV BAR (Only when editing a profile)
        if (stepName !== 'welcome' && stepName !== 'complete' && p) {
            html += `
                <div style="display: flex; justify-content: space-between; align-items:center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size: 1rem; color: var(--text-primary); font-weight: 600;">Editing: ${this.esc(p.profileName)}</span>
                        <select class="inp-box" style="padding: 6px 12px; font-size: 0.9rem; width:auto; border-radius: 8px;" onchange="window._studentProfile.jumpToStep(this.value)">
                            ${this.steps.map((s, i) => {
                                if(s === 'welcome' || s === 'complete') return '';
                                return `<option value="${i}" ${this.currentStep === i ? 'selected' : ''}>${this.formatStepName(s)}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <button class="btn-secondary" style="padding: 8px 16px; font-size:0.9rem;" onclick="window._studentProfile.saveAndExit()">Save & Exit</button>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">
                    <span>Wizard Progress</span>
                    <span>${completion}% Completed</span>
                </div>
                <div class="prog-bar"><div class="prog-fill" style="width: ${completion}%"></div></div>
            `;
        }

        html += `
                <div class="cv-card">
                    <div id="cv-quiz-view" class="cv-quiz-view ${animationIn}">
        `;

        // 1. WELCOME (DASHBOARD)
        if (stepName === 'welcome') {
            const profileKeys = Object.keys(this.profiles);
            let profilesHtml = '';
            
            if (profileKeys.length === 0) {
                profilesHtml = `
                    <div style="text-align:center; padding: 40px; color: var(--text-secondary);">
                        <div style="font-size: 3rem; margin-bottom:10px;">📄</div>
                        <p>You haven't created any profiles yet.</p>
                    </div>
                `;
            } else {
                profilesHtml = profileKeys.map(id => {
                    const prof = this.profiles[id];
                    const date = prof.savedAt ? new Date(prof.savedAt).toLocaleDateString() : 'Unknown';
                    return `
                        <div class="prof-card">
                            <div class="prof-card-info">
                                <h3 style="margin:0 0 6px 0; color: var(--text-primary); font-size:1.3rem; font-family: var(--font-display);">${this.esc(prof.profileName)}</h3>
                                <div style="color: var(--text-secondary); font-size:0.9rem; display:flex; align-items:center; gap:6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Last edited: ${date}
                                </div>
                            </div>
                            <div class="prof-card-actions">
                                <button class="btn-secondary" style="padding: 10px 16px; font-size: 0.9rem;" onclick="window._studentProfile.editProfile('${id}')">✏️ Edit</button>
                                <button class="btn-secondary" style="padding: 10px 16px; font-size: 0.9rem;" onclick="window._studentProfile.duplicateProfile('${id}')">📑 Copy</button>
                                <button class="btn-primary btn-export-euro" style="padding: 10px 16px; font-size: 0.9rem; background: #004494; width:100%;" onclick="window._studentProfile.exportEuropass('${id}')">🇪🇺 Europass CV</button>
                                <button class="btn-primary btn-export-pdf" style="padding: 10px 16px; font-size: 0.9rem; width:100%;" onclick="window._studentProfile.exportNormalPDF('${id}')">📄 Normal PDF</button>
                                <button class="btn-del-profile" onclick="window._studentProfile.deleteProfile('${id}')" title="Delete Profile">🗑️ Delete</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            html += `
                <div style="margin: auto; width: 100%;">
                    <div class="prof-dash-header">
                        <div>
                            <h2 class="q-title" style="margin:0;">Profile Dashboard</h2>
                            <p class="q-sub" style="margin:0;">Manage your academic profiles and CVs.</p>
                        </div>
                        <button class="btn-primary" style="padding: 10px 20px; white-space:nowrap; flex: 0 0 auto;" onclick="window._studentProfile.createNewProfile()">+ New Profile</button>
                    </div>
                    ${profilesHtml}
                </div>
            `;
        }
        else if (stepName === 'personal_names') {
            html += `
                <h2 class="q-title">Personal Information</h2>
                <p class="q-sub">Let's start with your official name.</p>
                <div class="grid-2">
                    <div class="inp-group">
                        <label class="inp-label">First Name</label>
                        <input type="text" class="inp-box" id="prof-fname" value="${this.esc(p.firstName)}" placeholder="e.g. Ali" autofocus>
                    </div>
                    <div class="inp-group">
                        <label class="inp-label">Last Name</label>
                        <input type="text" class="inp-box" id="prof-lname" value="${this.esc(p.lastName)}" placeholder="e.g. Khan">
                    </div>
                </div>
            `;
        }
        else if (stepName === 'personal_contact') {
            html += `
                <h2 class="q-title">Contact Details</h2>
                <p class="q-sub">How can universities or employers reach you?</p>
                <div class="grid-2">
                    <div class="inp-group">
                        <label class="inp-label">Email Address</label>
                        <input type="email" class="inp-box" id="prof-email" value="${this.esc(p.email)}" placeholder="ali@example.com">
                    </div>
                    <div class="inp-group">
                        <label class="inp-label">Phone Number</label>
                        <input type="tel" class="inp-box" id="prof-phone" value="${this.esc(p.phone)}" placeholder="+92 300 1234567">
                    </div>
                </div>
            `;
        }
        else if (stepName === 'personal_bio') {
            html += `
                <h2 class="q-title">Demographics</h2>
                <p class="q-sub">Standard demographic data for your profile.</p>
                <div class="inp-group">
                    <label class="inp-label">Date of Birth</label>
                    <input type="date" class="inp-box" id="prof-dob" value="${p.dob}" style="width: 200px;">
                </div>
                <div class="inp-group">
                    <label class="inp-label">Gender</label>
                    <div class="grid-3">
                        <div class="sel-btn gender-btn ${p.gender === 'Male' ? 'selected' : ''}" data-val="Male" onclick="window._studentProfile.selectBtn(this, 'gender-btn')">Male</div>
                        <div class="sel-btn gender-btn ${p.gender === 'Female' ? 'selected' : ''}" data-val="Female" onclick="window._studentProfile.selectBtn(this, 'gender-btn')">Female</div>
                        <div class="sel-btn gender-btn ${p.gender === 'Other' ? 'selected' : ''}" data-val="Other" onclick="window._studentProfile.selectBtn(this, 'gender-btn')">Other</div>
                    </div>
                </div>
            `;
        }
        else if (stepName === 'personal_location') {
            const natOpts = this.genOptions(this.data.nationalities, p.nationality);
            const citOpts = this.genOptions(this.data.cities, p.city);
            html += `
                <h2 class="q-title">Location</h2>
                <p class="q-sub">Where are you based?</p>
                <div class="grid-2">
                    <div class="inp-group">
                        <label class="inp-label">Nationality</label>
                        <select class="inp-box" id="prof-nationality" onchange="window._studentProfile.handleOtherSelect(this, 'prof-nationality-other')">
                            <option value="">Select...</option>${natOpts.html}
                        </select>
                        <input type="text" class="inp-box" id="prof-nationality-other" style="display:${natOpts.isCustom ? 'block' : 'none'}; margin-top:8px;" value="${natOpts.isCustom ? this.esc(p.nationality) : ''}" placeholder="Type your nationality">
                    </div>
                    <div class="inp-group">
                        <label class="inp-label">City</label>
                        <select class="inp-box" id="prof-city" onchange="window._studentProfile.handleOtherSelect(this, 'prof-city-other')">
                            <option value="">Select...</option>${citOpts.html}
                        </select>
                        <input type="text" class="inp-box" id="prof-city-other" style="display:${citOpts.isCustom ? 'block' : 'none'}; margin-top:8px;" value="${citOpts.isCustom ? this.esc(p.city) : ''}" placeholder="Type your city">
                    </div>
                </div>
                <div class="inp-group">
                    <label class="inp-label">Full Address (Optional)</label>
                    <input type="text" class="inp-box" id="prof-address" value="${this.esc(p.address)}" placeholder="e.g. House 1, Street 2...">
                </div>
            `;
        }
        else if (stepName === 'student_background') {
            html += `
                <h2 class="q-title">Background & Financials</h2>
                <p class="q-sub">This information is strictly for your consultant to assess scholarship/visa eligibility. It will <strong>NOT</strong> appear on your Europass CV.</p>
                <div class="grid-2">
                    <div class="inp-group">
                        <label class="inp-label">Monthly Family Income</label>
                        <select class="inp-box" id="prof-income">
                            <option value="">Select Range...</option>
                            <option value="Under 50,000 PKR" ${p.familyIncome === 'Under 50,000 PKR' ? 'selected' : ''}>Under 50,000 PKR</option>
                            <option value="50,000 - 100,000 PKR" ${p.familyIncome === '50,000 - 100,000 PKR' ? 'selected' : ''}>50,000 - 100,000 PKR</option>
                            <option value="100,000 - 250,000 PKR" ${p.familyIncome === '100,000 - 250,000 PKR' ? 'selected' : ''}>100,000 - 250,000 PKR</option>
                            <option value="250,000 - 500,000 PKR" ${p.familyIncome === '250,000 - 500,000 PKR' ? 'selected' : ''}>250,000 - 500,000 PKR</option>
                            <option value="Above 500,000 PKR" ${p.familyIncome === 'Above 500,000 PKR' ? 'selected' : ''}>Above 500,000 PKR</option>
                        </select>
                    </div>
                    <div class="inp-group">
                        <label class="inp-label">Father/Guardian's Occupation</label>
                        <input type="text" class="inp-box" id="prof-father-occ" value="${this.esc(p.fatherOccupation)}" placeholder="e.g. Government Employee, Business">
                    </div>
                </div>
                <div class="inp-group">
                    <label class="inp-label">Additional Background Details</label>
                    <textarea class="inp-box" id="prof-background-details" style="height:100px;" placeholder="Optional: Any other context about your family or financial situation that might help your consultant...">${this.esc(p.backgroundDetails)}</textarea>
                </div>
            `;
        }
        else if (stepName === 'education_details') {
            const instOpts = this.genOptions(this.data.institutions, '');
            const degOpts = this.genOptions(this.data.programs, '');

            const addedEdu = p.educationList.map((e, i) => `
                <div class="list-card">
                    <div>
                        <div class="list-card-content"><strong>${this.esc(e.degree)}</strong> at ${this.esc(e.institution)}</div>
                        <div class="list-card-meta">${this.esc(e.level)} | ${this.esc(e.startYear)} – ${this.esc(e.endYear)} | Score: ${this.esc(e.score)}/${this.esc(e.totalScore)}</div>
                    </div>
                    <button onclick="window._studentProfile.removeEducation(${i})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.5rem; padding: 0 10px;">×</button>
                </div>
            `).join('');

            html += `
                <h2 class="q-title">Education History</h2>
                <p class="q-sub">Add your academic qualifications. You can add multiple degrees/levels.</p>
                
                ${addedEdu ? `<div style="margin-bottom: 25px;">${addedEdu}</div>` : ''}

                <div style="padding: 20px; border: 2px dashed var(--border-color); border-radius: 12px; background: rgba(0,0,0,0.02);">
                    <div class="inp-group">
                        <label class="inp-label">Education Level</label>
                        <select class="inp-box" id="prof-edu-level">
                            <option value="Matric / O-Level">Matric / O-Level</option>
                            <option value="Intermediate / A-Level">Intermediate / A-Level</option>
                            <option value="Bachelor's Degree">Bachelor's Degree</option>
                            <option value="Master's Degree">Master's Degree</option>
                            <option value="PhD / Doctorate">PhD / Doctorate</option>
                        </select>
                    </div>
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Institution / Board Name</label>
                            <select class="inp-box" id="prof-institution" onchange="window._studentProfile.handleOtherSelect(this, 'prof-institution-other')">
                                <option value="">Select...</option>${instOpts.html}
                            </select>
                            <input type="text" class="inp-box" id="prof-institution-other" style="display:none; margin-top:8px;" placeholder="Type institution name">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">Degree / Stream</label>
                            <select class="inp-box" id="prof-degree" onchange="window._studentProfile.handleOtherSelect(this, 'prof-degree-other')">
                                <option value="">Select...</option>${degOpts.html}
                            </select>
                            <input type="text" class="inp-box" id="prof-degree-other" style="display:none; margin-top:8px;" placeholder="Type degree/stream name">
                        </div>
                    </div>
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Start Year</label>
                            <input type="number" class="inp-box" id="prof-edu-start" placeholder="YYYY">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">End Year</label>
                            <input type="number" class="inp-box" id="prof-edu-end" placeholder="YYYY">
                        </div>
                    </div>
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Score / CGPA</label>
                            <input type="number" class="inp-box" id="prof-edu-score" placeholder="e.g. 3.5 or 950" step="0.01">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">Out of (Total)</label>
                            <input type="number" class="inp-box" id="prof-edu-total" placeholder="e.g. 4.0 or 1100">
                        </div>
                    </div>
                    <button class="btn-secondary" style="width:100%; border: 2px solid var(--text-tertiary);" onclick="window._studentProfile.uiAddEducation()">+ Add Education Record</button>
                </div>
            `;
        }
        else if (stepName === 'experience_check') {
            html += `
                <h2 class="q-title">Work Experience</h2>
                <p class="q-sub">Do you have any internships, volunteer work, or professional jobs?</p>
                <div class="grid-2">
                    <div class="sel-btn exp-btn ${p.hasExperience ? 'selected' : ''}" data-val="yes" onclick="window._studentProfile.selectBtn(this, 'exp-btn'); window._studentProfile.nextStep();">Yes, I have experience</div>
                    <div class="sel-btn exp-btn ${!p.hasExperience && p.savedAt ? 'selected' : ''}" data-val="no" onclick="window._studentProfile.selectBtn(this, 'exp-btn'); window._studentProfile.nextStep();">No, skip this</div>
                </div>
            `;
        }
        else if (stepName === 'experience_details') {
            const roleOpts = this.genOptions(this.data.roles, '');
            
            const addedExp = p.experienceList.map((e, i) => `
                <div class="list-card">
                    <div>
                        <div class="list-card-content"><strong>${this.esc(e.role)}</strong> at ${this.esc(e.company)}</div>
                        <div class="list-card-meta">${this.esc(e.startYear)} – ${this.esc(e.endYear) || 'Present'}</div>
                    </div>
                    <button onclick="window._studentProfile.removeExperience(${i})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.5rem; padding: 0 10px;">×</button>
                </div>
            `).join('');

            html += `
                <h2 class="q-title">Experience History</h2>
                <p class="q-sub">Add your roles. You can add multiple experiences.</p>
                
                ${addedExp ? `<div style="margin-bottom: 25px;">${addedExp}</div>` : ''}

                <div style="padding: 20px; border: 2px dashed var(--border-color); border-radius: 12px; background: rgba(0,0,0,0.02);">
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Job Title / Role</label>
                            <select class="inp-box" id="prof-exp-role" onchange="window._studentProfile.handleOtherSelect(this, 'prof-exp-role-other')">
                                <option value="">Select Role...</option>${roleOpts.html}
                            </select>
                            <input type="text" class="inp-box" id="prof-exp-role-other" style="display:none; margin-top:8px;" placeholder="Type your role">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">Company / Organization</label>
                            <input type="text" class="inp-box" id="prof-exp-company" placeholder="e.g. TechCorp">
                        </div>
                    </div>
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Start Year</label>
                            <input type="number" class="inp-box" id="prof-exp-start" placeholder="YYYY">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">End Year (blank for Present)</label>
                            <input type="number" class="inp-box" id="prof-exp-end" placeholder="YYYY">
                        </div>
                    </div>
                    <button class="btn-secondary" style="width:100%; border: 2px solid var(--text-tertiary);" onclick="window._studentProfile.uiAddExperience()">+ Add Experience Record</button>
                </div>
            `;
        }
        else if (stepName === 'language_mother') {
            const langOpts = this.genOptions(this.data.languages, p.motherTongue);
            html += `
                <h2 class="q-title">Mother Tongue</h2>
                <p class="q-sub">What is your primary native language?</p>
                <div class="inp-group">
                    <label class="inp-label">Language</label>
                    <select class="inp-box" id="prof-mother-tongue" onchange="window._studentProfile.handleOtherSelect(this, 'prof-mother-tongue-other')">
                        <option value="">Select...</option>${langOpts.html}
                    </select>
                    <input type="text" class="inp-box" id="prof-mother-tongue-other" style="display:${langOpts.isCustom ? 'block' : 'none'}; margin-top:8px;" value="${langOpts.isCustom ? this.esc(p.motherTongue) : ''}" placeholder="Type your language">
                </div>
            `;
        }
        else if (stepName === 'language_other') {
            const langOpts = this.genOptions(this.data.languages, '');
            const addedLangs = p.otherLanguages.map((l, i) => `
                <div class="list-card" style="padding: 10px;">
                    <div><strong>${this.esc(l.lang)}</strong> &nbsp; <span style="color:var(--text-secondary)">${this.esc(l.level)}</span></div>
                    <button onclick="window._studentProfile.removeLang(${i})" style="background:none; border:none; color:red; cursor:pointer;">✖</button>
                </div>
            `).join('');

            html += `
                <h2 class="q-title">Other Languages</h2>
                <p class="q-sub">Add any other languages you speak.</p>
                <div style="margin-bottom: 20px;">${addedLangs}</div>
                <div style="padding: 20px; border: 2px dashed var(--border-color); border-radius: 12px; background: rgba(0,0,0,0.02);">
                    <div class="grid-2">
                        <div class="inp-group">
                            <label class="inp-label">Language</label>
                            <select class="inp-box" id="prof-other-lang" onchange="window._studentProfile.handleOtherSelect(this, 'prof-other-lang-other')">
                                <option value="">Select...</option>${langOpts.html}
                            </select>
                            <input type="text" class="inp-box" id="prof-other-lang-other" style="display:none; margin-top:8px;" placeholder="Type other language">
                        </div>
                        <div class="inp-group">
                            <label class="inp-label">Proficiency</label>
                            <div class="grid-3">
                                <div class="sel-btn lang-lvl-btn" style="padding:10px;" data-val="Basic" onclick="window._studentProfile.selectBtn(this, 'lang-lvl-btn')">Basic</div>
                                <div class="sel-btn lang-lvl-btn" style="padding:10px;" data-val="Fluent" onclick="window._studentProfile.selectBtn(this, 'lang-lvl-btn')">Fluent</div>
                                <div class="sel-btn lang-lvl-btn" style="padding:10px;" data-val="Native" onclick="window._studentProfile.selectBtn(this, 'lang-lvl-btn')">Native</div>
                            </div>
                        </div>
                    </div>
                    <button class="btn-secondary" style="width:100%; border: 2px solid var(--text-tertiary);" onclick="window._studentProfile.uiAddLanguage()">+ Add Language</button>
                </div>
            `;
        }
        else if (stepName === 'skills_digital') {
            const tags = this.data.digitalSkills.map(s => {
                const isActive = p.digitalSkills.includes(s) ? 'active' : '';
                return `<div class="tag-item ${isActive}" onclick="window._studentProfile.toggleArrayItem('digitalSkills', '${s}')">${s}</div>`;
            }).join('');
            const customTags = p.digitalSkills.filter(s => !this.data.digitalSkills.includes(s)).map(s => `
                <div class="tag-item active" onclick="window._studentProfile.toggleArrayItem('digitalSkills', '${s}')">${s}</div>
            `).join('');

            html += `
                <h2 class="q-title">Digital Skills</h2>
                <p class="q-sub">Select the software, tools, and tech you know.</p>
                <div class="tag-cloud" style="margin-bottom: 20px;">
                    ${tags}
                    ${customTags}
                </div>
                <div class="inp-group">
                    <label class="inp-label">Add Other Digital Skill</label>
                    <div style="display:flex; gap:10px;">
                        <input type="text" class="inp-box" id="custom-digital-skill" placeholder="e.g. Blender, Ruby on Rails">
                        <button class="btn-secondary" onclick="const val = document.getElementById('custom-digital-skill').value; if(val) window._studentProfile.toggleArrayItem('digitalSkills', val);">Add</button>
                    </div>
                </div>
            `;
        }
        else if (stepName === 'skills_soft') {
            const tags = this.data.softSkills.map(s => {
                const isActive = p.softSkills.includes(s) ? 'active' : '';
                return `<div class="tag-item ${isActive}" onclick="window._studentProfile.toggleArrayItem('softSkills', '${s}')">${s}</div>`;
            }).join('');
            const customTags = p.softSkills.filter(s => !this.data.softSkills.includes(s)).map(s => `
                <div class="tag-item active" onclick="window._studentProfile.toggleArrayItem('softSkills', '${s}')">${s}</div>
            `).join('');

            html += `
                <h2 class="q-title">Soft Skills</h2>
                <p class="q-sub">Select your interpersonal and management skills.</p>
                <div class="tag-cloud" style="margin-bottom: 20px;">
                    ${tags}
                    ${customTags}
                </div>
                <div class="inp-group">
                    <label class="inp-label">Add Other Soft Skill</label>
                    <div style="display:flex; gap:10px;">
                        <input type="text" class="inp-box" id="custom-soft-skill" placeholder="e.g. Negotiation, Empathy">
                        <button class="btn-secondary" onclick="const val = document.getElementById('custom-soft-skill').value; if(val) window._studentProfile.toggleArrayItem('softSkills', val);">Add</button>
                    </div>
                </div>
            `;
        }
        else if (stepName === 'future_goals') {
            html += `
                <h2 class="q-title">Future Aspirations</h2>
                <p class="q-sub">Optional: Tell us what you plan to study and your main objective.</p>
                <div class="inp-group">
                    <label class="inp-label">Future Field of Study</label>
                    <input type="text" class="inp-box" id="prof-future-field" value="${this.esc(p.futureFieldOfStudy)}" placeholder="e.g. Master's in Artificial Intelligence">
                </div>
                <div class="inp-group">
                    <label class="inp-label">Professional Objective / Motive</label>
                    <textarea class="inp-box" id="prof-personal-motive" placeholder="A brief statement about your career goals...">${this.esc(p.personalMotive)}</textarea>
                </div>
            `;
        }
        else if (stepName === 'extracurriculars') {
            html += `
                <h2 class="q-title">Extracurricular Activities</h2>
                <p class="q-sub">Optional: Clubs, sports, volunteering, or hobbies.</p>
                <div class="inp-group">
                    <label class="inp-label">Your Activities</label>
                    <textarea class="inp-box" id="prof-extracurriculars" style="height:150px;" placeholder="e.g. President of Debating Society, Volunteer at Red Cross...">${this.esc(p.extracurriculars)}</textarea>
                </div>
            `;
        }
        else if (stepName === 'certifications') {
            html += `
                <h2 class="q-title">Certifications & Achievements</h2>
                <p class="q-sub">Optional: Any notable courses or awards?</p>
                <div class="inp-group">
                    <label class="inp-label">List them here</label>
                    <textarea class="inp-box" id="prof-certs" style="height:120px;" placeholder="e.g. Coursera Python Bootcamp (2023)">${this.esc(p.certifications)}</textarea>
                </div>
            `;
        }
        else if (stepName === 'complete') {
            html += `
                <div style="text-align: center; margin: auto;">
                    <div style="font-size: 5rem; margin-bottom: 20px; color: var(--accent-primary);">✓</div>
                    <h2 class="q-title">Profile Completed!</h2>
                    <p class="q-sub" style="max-width: 450px; margin: 0 auto 40px auto;">Your data is saved securely. You can generate PDFs now or return to the Dashboard.</p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn-primary" style="font-size: 1.1rem; padding: 15px 30px; display:inline-flex; align-items:center; gap:10px; margin-bottom: 10px; background: #004494;" onclick="window._studentProfile.exportEuropass()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Europass CV
                        </button>
                        <button class="btn-secondary" style="font-size: 1.1rem; padding: 15px 30px; display:inline-flex; align-items:center; gap:10px; border: 2px solid var(--accent-primary); color: var(--text-primary); margin-bottom: 10px;" onclick="window._studentProfile.exportNormalPDF()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Download Normal PDF
                        </button>
                    </div>
                </div>
            `;
        }

        // FOOTER NAV
        if (stepName !== 'welcome' && stepName !== 'complete') {
            html += `
                    </div> <!-- End cv-quiz-view -->
                    <div class="q-nav">
                        <button class="btn-secondary" onclick="window._studentProfile.prevStep()">← Back</button>
                        <button class="btn-primary" onclick="window._studentProfile.nextStep()">Next →</button>
                    </div>
            `;
        } else {
            html += `</div>`; // Close view
            if (stepName === 'complete') {
                html += `
                    <div class="q-nav" style="justify-content: center; margin-top: 30px;">
                        <button class="btn-secondary" onclick="window._studentProfile.saveAndExit()">Return to Dashboard</button>
                    </div>
                `;
            }
        }

        html += `
                </div> <!-- End cv-card -->
            </div> <!-- End cv-quiz-container -->
        `;

        container.innerHTML = html;
        window._studentProfile = this;
    }

    // EUROPASS EXPORT LOGIC - STRICTLY FILTERED (No Income, No Background, No Future Aspirations)
    exportEuropass(profileId = null) {
        if (window.ScholarAuth && !window.ScholarAuth.requirePlan('pro', 'Export Profile as CV')) {
            return;
        }

        const p = profileId ? this.profiles[profileId] : this.profile;
        if (!p) return;

        if (!window.html2pdf) {
            alert('PDF library not loaded yet. Please wait a few seconds.');
            return;
        }
        if (window.showToast) window.showToast('Compiling Europass CV...', 'info');

        const name = `${p.firstName} ${p.lastName}`.trim() || 'Student Name';
        const europassBlue = '#004494';
        
        const row = (label, content) => `
            <div style="display: flex; margin-bottom: 8px;">
                <div style="width: 25%; color: ${europassBlue}; font-size: 11px; text-align: right; padding-right: 15px; padding-top: 2px;">${label}</div>
                <div style="width: 75%; font-size: 12px; border-left: 1px solid #ccc; padding-left: 15px;">${content}</div>
            </div>
        `;
        const sectionTitle = (title) => `
            <div style="display: flex; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid ${europassBlue}; padding-bottom: 5px;">
                <div style="width: 25%; color: ${europassBlue}; font-weight: bold; font-size: 14px; text-align: right; padding-right: 15px; text-transform: uppercase;">${title}</div>
                <div style="width: 75%;"></div>
            </div>
        `;

        let eduHTML = p.educationList.map(e => `
            <div style="margin-bottom: 12px;">
                <div style="color: ${europassBlue}; font-size: 11px;">${this.esc(e.startYear)} – ${this.esc(e.endYear)}</div>
                <div style="font-weight: bold; font-size: 13px;">${this.esc(e.degree)}</div>
                <div style="font-style: italic;">${this.esc(e.institution)}</div>
                ${e.score ? `<div>Score: ${this.esc(e.score)} / ${this.esc(e.totalScore)}</div>` : ''}
            </div>
        `).join('');

        let expHTML = p.experienceList.map(e => `
            <div style="margin-bottom: 12px;">
                <div style="color: ${europassBlue}; font-size: 11px;">${this.esc(e.startYear)} – ${this.esc(e.endYear) || 'Present'}</div>
                <div style="font-weight: bold; font-size: 13px;">${this.esc(e.role)}</div>
                <div style="font-style: italic;">${this.esc(e.company)}</div>
            </div>
        `).join('');

        let otherLangsHTML = p.otherLanguages.map(l => `<div style="margin-bottom: 5px;"><strong>${this.esc(l.lang)}</strong>: ${this.esc(l.level)}</div>`).join('');

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.4; background: #ffffff; color: #000000;">
                <div style="display: flex; margin-bottom: 30px;">
                    <div style="width: 25%; text-align: right; padding-right: 15px;">
                        <div style="color: ${europassBlue}; font-weight: bold; font-size: 24px; letter-spacing: 1px;">europass</div>
                    </div>
                    <div style="width: 75%; padding-left: 15px;">
                        <h1 style="color: ${europassBlue}; font-size: 28px; margin: 0 0 10px 0; font-weight: normal;">Curriculum Vitae</h1>
                    </div>
                </div>

                ${sectionTitle('Personal Information')}
                ${row('Name', `<strong style="font-size: 16px;">${this.esc(name)}</strong>`)}
                ${p.address || p.city ? row('Address', `${this.esc(p.address)}, ${this.esc(p.city)}, ${this.esc(p.nationality)}`) : ''}
                ${p.phone ? row('Phone', this.esc(p.phone)) : ''}
                ${p.email ? row('Email', `<a href="mailto:${this.esc(p.email)}" style="color: ${europassBlue}; text-decoration: none;">${this.esc(p.email)}</a>`) : ''}
                ${p.gender || p.dob || p.nationality ? row('Nationality / Gender / DOB', `${this.esc(p.nationality)} | ${this.esc(p.gender)} | ${this.esc(p.dob)}`) : ''}

                ${p.hasExperience && p.experienceList.length > 0 ? `
                    ${sectionTitle('Work Experience')}
                    <div style="display: flex;">
                        <div style="width: 25%;"></div>
                        <div style="width: 75%; border-left: 1px solid #ccc; padding-left: 15px;">${expHTML}</div>
                    </div>
                ` : ''}

                ${p.educationList.length > 0 ? `
                    ${sectionTitle('Education and Training')}
                    <div style="display: flex;">
                        <div style="width: 25%;"></div>
                        <div style="width: 75%; border-left: 1px solid #ccc; padding-left: 15px;">${eduHTML}</div>
                    </div>
                ` : ''}

                ${sectionTitle('Personal Skills')}
                ${p.motherTongue ? row('Mother tongue(s)', `<strong>${this.esc(p.motherTongue)}</strong>`) : ''}
                ${p.otherLanguages.length > 0 ? row('Other language(s)', otherLangsHTML) : ''}
                ${p.digitalSkills.length > 0 ? row('Digital skills', p.digitalSkills.join(', ')) : ''}
                ${p.softSkills.length > 0 ? row('Other skills', p.softSkills.join(', ')) : ''}

                ${p.certifications ? `
                    ${sectionTitle('Certifications')}
                    ${row('Details', this.esc(p.certifications).replace(/\n/g, '<br>'))}
                ` : ''}
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `${name.replace(/\s+/g, '_')}_Europass_CV.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(htmlContent).save().then(() => {
            if (window.showToast) window.showToast('Europass CV downloaded!', 'success');
        });
    }

    // NORMAL PDF EXPORT LOGIC - INCLUDES EVERYTHING (Income, Background, Motives, Extracurriculars)
    exportNormalPDF(profileId = null) {
        if (window.ScholarAuth && !window.ScholarAuth.requirePlan('pro', 'Export Profile as CV')) {
            return;
        }

        const p = profileId ? this.profiles[profileId] : this.profile;
        if (!p) return;

        if (!window.html2pdf) {
            alert('PDF library not loaded yet.');
            return;
        }
        if (window.showToast) window.showToast('Compiling Standard Profile...', 'info');

        const name = `${p.firstName} ${p.lastName}`.trim() || 'Student Name';
        
        const sectionTitle = (title) => `
            <div style="margin-top: 25px; margin-bottom: 12px; border-bottom: 2px solid #2d3748; padding-bottom: 5px;">
                <h3 style="margin: 0; color: #2d3748; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px;">${title}</h3>
            </div>
        `;
        const row = (label, content) => `
            <div style="margin-bottom: 8px;">
                <strong style="color: #4a5568;">${label}:</strong> <span style="color: #1a202c;">${content}</span>
            </div>
        `;

        let otherLangsHTML = p.otherLanguages.map(l => `<span>${this.esc(l.lang)} (${this.esc(l.level)})</span>`).join(', ');

        let eduHTML = p.educationList.map(e => `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; color: #2d3748; margin-bottom: 2px;">
                    <span>${this.esc(e.degree)}</span>
                    <span>${this.esc(e.startYear)} – ${this.esc(e.endYear)}</span>
                </div>
                <div style="font-size: 14px; color: #4a5568;">${this.esc(e.institution)}</div>
                ${e.score ? `<div style="font-size: 13px; color: #718096; margin-top:2px;">Score: ${this.esc(e.score)} / ${this.esc(e.totalScore)}</div>` : ''}
            </div>
        `).join('');

        let expHTML = p.experienceList.map(e => `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; color: #2d3748; margin-bottom: 2px;">
                    <span>${this.esc(e.role)}</span>
                    <span>${this.esc(e.startYear)} – ${this.esc(e.endYear) || 'Present'}</span>
                </div>
                <div style="font-size: 14px; color: #4a5568;">${this.esc(e.company)}</div>
            </div>
        `).join('');

        const htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; line-height: 1.6; background: #ffffff; color: #1a202c;">
                <div style="text-align: center; margin-bottom: 35px;">
                    <h1 style="margin: 0 0 10px 0; font-size: 36px; color: #1a202c; font-weight: 700; letter-spacing: 1px;">${this.esc(name)}</h1>
                    <div style="font-size: 14px; color: #4a5568;">
                        ${[this.esc(p.city), this.esc(p.nationality)].filter(Boolean).join(', ')} &nbsp;|&nbsp; 
                        ${this.esc(p.phone)} &nbsp;|&nbsp; 
                        ${this.esc(p.email)}
                    </div>
                </div>

                ${p.familyIncome || p.fatherOccupation || p.backgroundDetails ? `
                    ${sectionTitle('Background & Financials (Consultant View)')}
                    ${p.familyIncome ? row('Monthly Family Income', this.esc(p.familyIncome)) : ''}
                    ${p.fatherOccupation ? row("Father/Guardian's Occupation", this.esc(p.fatherOccupation)) : ''}
                    ${p.backgroundDetails ? `<div style="text-align: justify; font-size: 13.5px; color: #2d3748; margin-top: 8px;"><strong>Additional Details:</strong><br>${this.esc(p.backgroundDetails).replace(/\n/g, '<br>')}</div>` : ''}
                ` : ''}

                ${p.personalMotive ? `
                    ${sectionTitle('Professional Objective')}
                    <div style="text-align: justify; font-size: 13.5px; color: #2d3748;">${this.esc(p.personalMotive).replace(/\n/g, '<br>')}</div>
                ` : ''}

                ${p.futureFieldOfStudy ? `
                    ${sectionTitle('Future Aspirations')}
                    ${row('Intended Field of Study', this.esc(p.futureFieldOfStudy))}
                ` : ''}

                ${p.educationList.length > 0 ? `
                    ${sectionTitle('Education')}
                    ${eduHTML}
                ` : ''}

                ${p.hasExperience && p.experienceList.length > 0 ? `
                    ${sectionTitle('Experience')}
                    ${expHTML}
                ` : ''}
                
                ${sectionTitle('Skills & Languages')}
                <div style="font-size: 13.5px;">
                    ${p.motherTongue ? row('Mother Tongue', this.esc(p.motherTongue)) : ''}
                    ${p.otherLanguages.length > 0 ? row('Other Languages', otherLangsHTML) : ''}
                    ${p.digitalSkills.length > 0 ? row('Technical Skills', p.digitalSkills.join(', ')) : ''}
                    ${p.softSkills.length > 0 ? row('Soft Skills', p.softSkills.join(', ')) : ''}
                </div>

                ${p.extracurriculars ? `
                    ${sectionTitle('Extracurricular Activities')}
                    <div style="text-align: justify; font-size: 13.5px; color: #2d3748;">${this.esc(p.extracurriculars).replace(/\n/g, '<br>')}</div>
                ` : ''}

                ${p.certifications ? `
                    ${sectionTitle('Certifications & Achievements')}
                    <div style="text-align: justify; font-size: 13.5px; color: #2d3748;">${this.esc(p.certifications).replace(/\n/g, '<br>')}</div>
                ` : ''}
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `${name.replace(/\s+/g, '_')}_Standard_Profile.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(htmlContent).save().then(() => {
            if (window.showToast) window.showToast('Standard Profile downloaded!', 'success');
        });
    }

    esc(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
}

window.StudentProfile = StudentProfile;
