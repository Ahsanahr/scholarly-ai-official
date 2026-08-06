/**
 * ScholarPath AI — Authentication & Modal Controller
 * Handles Firebase Auth (Email/Password, Google SSO, Logout) and UI state.
 */

// --- START OF LOCAL STORAGE PROXY ---
(function() {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    // Keys that contain personal user data
    const personalKeys = [
        'scholarly_articles_v3',
        'scholarly_documents_v3',
        'scholarpath_sops_v2',
        'scholarpath_sop', // Legacy SOP key
        'scholarpath_tracker',
        'scholarpath_profiles_v2',
        'scholarpath_saved_results',
        'scholarpath_timeline_events',
        'scholarpath_prep_tasks',
        'scholarpath_calc_scores',
        'mm_hssc',
        'mm_ssc',
        'mm_stream',
        'mm_income'
    ];

    function getUserSuffix() {
        if (typeof window !== 'undefined') {
            // Check for admin
            if (originalGetItem.call(localStorage, 'scholarly_admin') === 'true') {
                return '_admin';
            }
            // Check for demo user
            const demoStr = originalGetItem.call(localStorage, 'scholarpath_demo_user');
            if (demoStr) {
                try {
                    const demoUser = JSON.parse(demoStr);
                    if (demoUser && demoUser.uid) return '_' + demoUser.uid;
                } catch(e) {}
            }
            // Check for synchronous active UID (fixes async Firebase load issues)
            const activeUid = originalGetItem.call(localStorage, 'scholarpath_active_uid');
            if (activeUid) {
                return '_' + activeUid;
            }
            // Check for real Firebase user (fallback)
            if (window.ScholarAuth && window.ScholarAuth.currentUser) {
                return '_' + (window.ScholarAuth.currentUser.uid || window.ScholarAuth.currentUser.email);
            }
        }
        return '_guest';
    }

    function isPersonalKey(key) {
        if (!key) return false;
        // Only intercept the exact base keys to prevent double-suffixing
        return personalKeys.includes(key);
    }

    function migrateDataIfNeeded(baseKey, scopedKey) {
        // If scoped data doesn't exist yet, but unscoped data DOES exist, copy it over securely
        const unscopedData = originalGetItem.call(localStorage, baseKey);
        const scopedData = originalGetItem.call(localStorage, scopedKey);
        
        if (unscopedData && !scopedData) {
            originalSetItem.call(localStorage, scopedKey, unscopedData);
        }
    }

    localStorage.setItem = function(key, value) {
        if (isPersonalKey(key)) {
            const suffix = getUserSuffix();
            
            // Enforce Login Requirement
            if (suffix === '_guest') {
                if (window.ScholarAuth && typeof window.ScholarAuth.openModal === 'function') {
                    window.ScholarAuth.showAlert('Please log in or create an account to save your personal data.', 'error');
                    window.ScholarAuth.openModal('login');
                } else {
                    alert('Please log in to save personal data.');
                }
                // Silently block saving to prevent unauthorized local writes
                return;
            }

            const scopedKey = key + suffix;
            migrateDataIfNeeded(key, scopedKey);
            return originalSetItem.call(localStorage, scopedKey, value);
        }
        return originalSetItem.call(localStorage, key, value);
    };

    localStorage.getItem = function(key) {
        if (isPersonalKey(key)) {
            const scopedKey = key + getUserSuffix();
            migrateDataIfNeeded(key, scopedKey);
            return originalGetItem.call(localStorage, scopedKey);
        }
        return originalGetItem.call(localStorage, key);
    };

    localStorage.removeItem = function(key) {
        if (isPersonalKey(key)) {
            const scopedKey = key + getUserSuffix();
            return originalRemoveItem.call(localStorage, scopedKey);
        }
        return originalRemoveItem.call(localStorage, key);
    };
})();
// --- END OF LOCAL STORAGE PROXY ---

class AuthController {
    constructor() {
        this.currentUser = null;
        this.currentMode = 'login'; // 'login' | 'signup'
        this.init();
    }

    init() {
        const initialize = () => {
            this.bindEvents();
            this.listenAuthState();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    bindEvents() {
        // Global Modal triggers
        document.addEventListener('click', (e) => {
            const openBtn = e.target.closest('[data-auth-trigger]');
            if (openBtn) {
                e.preventDefault();
                const tab = openBtn.dataset.authTrigger || 'login';
                this.openModal(tab);
            }

            // User Avatar Dropdown toggle
            const avatarBtn = e.target.closest('#userAvatarBtn');
            if (avatarBtn) {
                e.preventDefault();
                const menu = document.getElementById('userProfileMenu');
                if (menu) menu.classList.toggle('active');
            } else if (!e.target.closest('#userProfileMenu')) {
                const menu = document.getElementById('userProfileMenu');
                if (menu) menu.classList.remove('active');
            }
        });

        // Close modal triggers
        const backdrop = document.getElementById('authBackdrop');
        const closeBtn = document.getElementById('authCloseBtn');
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeModal();
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Tab Switching
        const tabLogin = document.getElementById('tabLogin');
        const tabSignup = document.getElementById('tabSignup');
        if (tabLogin && tabSignup) {
            tabLogin.addEventListener('click', () => this.switchTab('login'));
            tabSignup.addEventListener('click', () => this.switchTab('signup'));
        }

        // Form Submission
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Google SSO
        const googleBtn = document.getElementById('googleAuthBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleAuth());
        }

        // Password Reset Link
        const forgotLink = document.getElementById('forgotPassLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePasswordReset();
            });
        }

        // Sign Out Button
        document.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('[data-auth-logout]');
            if (logoutBtn) {
                e.preventDefault();
                this.signOut();
            }
        });
    }

    listenAuthState() {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    localStorage.setItem('scholarpath_active_uid', user.uid);
                    if (user.email && user.email.toLowerCase() === 'trazoexplains') {
                        localStorage.setItem('scholarly_admin', 'true');
                    } else {
                        localStorage.removeItem('scholarly_admin');
                    }
                    this.syncStudentProfile(user);
                    this.syncUserToAdminDb(user);
                } else {
                    localStorage.removeItem('scholarpath_active_uid');
                }
                this.updateUI(user);
            });
        }
    }

    openModal(mode = 'login', alertMessage = null, alertType = 'info') {
        const backdrop = document.getElementById('authBackdrop');
        if (!backdrop) return;

        this.switchTab(mode);
        backdrop.classList.add('active');

        if (alertMessage) {
            this.showAlert(alertMessage, alertType);
        }

        // Check if Firebase is configured
        const configNotice = document.getElementById('authConfigNotice');
        if (configNotice) {
            if (!isFirebaseConfigured()) {
                configNotice.style.display = 'block';
            } else {
                configNotice.style.display = 'none';
            }
        }
    }

    closeModal() {
        const backdrop = document.getElementById('authBackdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
        }
    }

    switchTab(mode) {
        this.currentMode = mode;
        const tabLogin = document.getElementById('tabLogin');
        const tabSignup = document.getElementById('tabSignup');
        const nameGroup = document.getElementById('authNameGroup');
        const submitBtnText = document.getElementById('authSubmitText');
        const forgotLink = document.getElementById('forgotPassLink');

        if (mode === 'signup') {
            if (tabSignup) tabSignup.classList.add('active');
            if (tabLogin) tabLogin.classList.remove('active');
            if (nameGroup) nameGroup.style.display = 'flex';
            if (submitBtnText) submitBtnText.textContent = 'Create Account';
            if (forgotLink) forgotLink.style.display = 'none';
        } else {
            if (tabLogin) tabLogin.classList.add('active');
            if (tabSignup) tabSignup.classList.remove('active');
            if (nameGroup) nameGroup.style.display = 'none';
            if (submitBtnText) submitBtnText.textContent = 'Sign In';
            if (forgotLink) forgotLink.style.display = 'inline-block';
        }
        this.clearAlert();
    }

    showAlert(message, type = 'error') {
        const alertBox = document.getElementById('authAlert');
        if (!alertBox) return;
        alertBox.className = `auth-alert active ${type}`;
        alertBox.innerHTML = `
            <span>${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
            <div>${message}</div>
        `;
    }

    clearAlert() {
        const alertBox = document.getElementById('authAlert');
        if (alertBox) {
            alertBox.className = 'auth-alert';
            alertBox.innerHTML = '';
        }
    }

    setLoading(loading) {
        const btn = document.getElementById('authSubmitBtn');
        const text = document.getElementById('authSubmitText');
        const spinner = document.getElementById('authSubmitSpinner');
        if (!btn) return;

        btn.disabled = loading;
        if (loading) {
            if (spinner) spinner.style.display = 'inline-block';
            if (text) text.style.opacity = '0.7';
        } else {
            if (spinner) spinner.style.display = 'none';
            if (text) text.style.opacity = '1';
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById('authEmail');
        const passInput = document.getElementById('authPassword');
        const nameInput = document.getElementById('authName');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value : '';
        const name = nameInput ? nameInput.value.trim() : '';

        // Admin login intercept
        if (email.toLowerCase() === 'trazoexplains' && password === 'Ahsan123$') {
            const adminUser = {
                uid: 'admin_trazoexplains',
                displayName: 'Admin (Trazo)',
                email: 'trazoexplains',
                photoURL: null,
                role: 'owner',
                isAdmin: true
            };
            localStorage.setItem('scholarly_admin', 'true');
            localStorage.setItem('scholarpath_demo_user', JSON.stringify(adminUser));
            this.currentUser = adminUser;
            this.updateUI(adminUser);
            this.showAlert('Admin access granted! Welcome Admin.', 'success');
            setTimeout(() => {
                location.reload();
            }, 800);
            return;
        }

        // Non-admin login: explicitly strip any leftover admin flag
        localStorage.removeItem('scholarly_admin');

        if (!email || !password) {
            this.showAlert('Please fill in both email and password.');
            return;
        }

        if (this.currentMode === 'signup' && !name) {
            this.showAlert('Please enter your full name.');
            return;
        }

        // If Firebase Credentials are not configured yet, offer interactive demo feedback
        if (!isFirebaseConfigured()) {
            this.simulateDemoAuth(email, name);
            return;
        }

        this.setLoading(true);
        this.clearAlert();

        try {
            if (this.currentMode === 'signup') {
                const credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                if (credential.user && name) {
                    await credential.user.updateProfile({ displayName: name });
                }
                this.showAlert('Account created successfully! Welcome to ScholarPath AI.', 'success');
                setTimeout(() => this.closeModal(), 1200);
            } else {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                this.showAlert('Signed in successfully!', 'success');
                setTimeout(() => this.closeModal(), 1000);
            }
        } catch (error) {
            console.error('Firebase Auth Error:', error);
            let userMsg = error.message || 'Authentication failed.';
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                userMsg = 'Invalid email or password.';
            } else if (error.code === 'auth/email-already-in-use') {
                userMsg = 'An account with this email already exists. Try signing in.';
            } else if (error.code === 'auth/weak-password') {
                userMsg = 'Password should be at least 6 characters.';
            }
            this.showAlert(userMsg, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleGoogleAuth() {
        if (!isFirebaseConfigured()) {
            this.showAlert('Google Sign-In requires active Firebase credentials in js/firebase-config.js.', 'info');
            return;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
            this.showAlert('Signed in with Google!', 'success');
            setTimeout(() => this.closeModal(), 1000);
        } catch (error) {
            console.error('Google Auth Error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                this.showAlert(error.message || 'Google Sign-In failed.', 'error');
            }
        }
    }

    async handlePasswordReset() {
        const emailInput = document.getElementById('authEmail');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email) {
            this.showAlert('Please enter your email address in the field above to reset your password.', 'info');
            return;
        }

        if (!isFirebaseConfigured()) {
            this.showAlert(`Demo Mode: Password reset link would be sent to ${email}. Add your Firebase API key to send live emails.`, 'info');
            return;
        }

        try {
            await firebase.auth().sendPasswordResetEmail(email);
            this.showAlert(`Password reset email sent to ${email}. Please check your inbox.`, 'success');
        } catch (error) {
            this.showAlert(error.message || 'Failed to send password reset email.', 'error');
        }
    }

    async signOut() {
        localStorage.removeItem('scholarly_admin');
        localStorage.removeItem('scholarpath_demo_user');
        localStorage.removeItem('scholarpath_active_uid');
        localStorage.removeItem('scholarly_user_plan');
        this.currentUser = null;

        if (typeof firebase !== 'undefined' && firebase.auth && isFirebaseConfigured()) {
            try {
                await firebase.auth().signOut();
            } catch (e) {
                console.error('Signout error:', e);
            }
        }
        
        this.updateUI(null);
        
        const adminLink = document.getElementById('adminSidebarLink');
        if (adminLink) adminLink.style.display = 'none';

        setTimeout(() => location.reload(), 200);
    }

    simulateDemoAuth(email, name) {
        this.setLoading(true);
        setTimeout(() => {
            const displayName = name || email.split('@')[0];
            const demoUser = {
                uid: 'demo_' + Date.now(),
                email: email,
                displayName: displayName,
                photoURL: null
            };
            if (email.toLowerCase() === 'trazoexplains') {
                localStorage.setItem('scholarly_admin', 'true');
            } else {
                localStorage.removeItem('scholarly_admin');
            }
            localStorage.setItem('scholarpath_demo_user', JSON.stringify(demoUser));
            this.currentUser = demoUser;
            this.updateUI(demoUser);
            this.syncStudentProfile(demoUser);
            this.syncUserToAdminDb(demoUser);
            this.setLoading(false);
            this.showAlert('Logged in successfully!', 'success');
            setTimeout(() => this.closeModal(), 1500);
        }, 600);
    }

    syncStudentProfile(user) {
        try {
            if (window._studentProfile && window._studentProfile.profile && user) {
                if (!window._studentProfile.profile.name && user.displayName) {
                    window._studentProfile.profile.name = user.displayName;
                }
                if (!window._studentProfile.profile.email && user.email) {
                    window._studentProfile.profile.email = user.email;
                }
                if (typeof window._studentProfile.save === 'function') {
                    window._studentProfile.save();
                }
            }
        } catch (e) {
            console.error('Error syncing student profile:', e);
        }
    }

    async syncUserToAdminDb(user) {
        if (!user || (!user.email && !user.displayName)) return;
        try {
            const email = user.email || (user.displayName ? user.displayName.toLowerCase().replace(/\s+/g, '') + '@user.com' : 'user@scholarpath.ai');
            const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Student');
            await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register',
                    user: {
                        id: user.uid || 'usr_' + Date.now(),
                        name: name,
                        email: email,
                        plan: 'free',
                        credits: 15,
                        joinedDate: new Date().toISOString().split('T')[0]
                    }
                })
            });
        } catch (e) {
            console.error('Error syncing user to admin DB:', e);
        }
    }

    updateUI(user) {
        // If demo user saved
        if (!user) {
            const savedDemo = localStorage.getItem('scholarpath_demo_user');
            if (savedDemo) {
                try { user = JSON.parse(savedDemo); } catch(e){}
            }
        }

        const navContainer = document.getElementById('authNavContainer') || document.getElementById('navLinks');
        const loginBtn = document.getElementById('navLoginBtn');
        const profileBtn = document.getElementById('navProfileBtn');
        const creditToggle = document.getElementById('creditToggle');

        // Check if we have user avatar pill element or need to render it
        let userMenu = document.getElementById('userProfileMenu');

        if (user) {
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
            const initial = displayName.charAt(0).toUpperCase();
            const avatarSrc = user.photoURL ? `<img src="${user.photoURL}" class="user-avatar-img" alt="${displayName}">` : `<div class="user-avatar-img">${initial}</div>`;

            if (loginBtn) loginBtn.style.display = 'none';
            if (profileBtn) profileBtn.style.display = 'none'; // Submerged into the dropdown menu to make space for credit!
            if (creditToggle) creditToggle.style.display = 'flex';

            // Fetch actual credits and plan from Firestore / local state
            const creditLabel = document.getElementById('creditLabel');
            const cacheKey = 'scholarly_user_credits_' + (user.uid || 'demo');
            
            if (this.isOwner()) {
                if (creditLabel) creditLabel.textContent = `👑 Owner (Unlimited)`;
            } else if (typeof firebase !== 'undefined' && firebase.auth && isFirebaseConfigured() && user.uid && !user.uid.startsWith('demo_')) {
                // First check local storage cache
                const cachedCredits = localStorage.getItem(cacheKey);
                if (cachedCredits !== null && creditLabel) {
                    creditLabel.textContent = `${cachedCredits}`;
                }

                if (window.creditsUnsubscribe) window.creditsUnsubscribe();
                
                window.creditsUnsubscribe = firebase.firestore().collection('users').doc(user.uid)
                    .onSnapshot(doc => {
                        if (creditLabel) {
                            if (this.isOwner()) {
                                creditLabel.textContent = `👑 Owner (Unlimited)`;
                            } else {
                                const credits = doc.exists && doc.data()?.credits !== undefined ? doc.data().credits : (cachedCredits !== null ? parseInt(cachedCredits) : 15);
                                creditLabel.textContent = `${credits}`;
                                localStorage.setItem(cacheKey, credits);
                            }
                        }
                    }, err => {
                        console.error("Error getting user credits:", err);
                        // Fallback to local storage if available
                        const fallback = localStorage.getItem(cacheKey) || 15;
                        if (creditLabel) creditLabel.textContent = `${fallback}`;
                    });
            } else {
                const storedPlan = this.getUserPlan();
                const defaultCredits = storedPlan === 'premium' || storedPlan === 'premier' ? 450 : storedPlan === 'pro' ? 50 : 15;
                const cachedCredits = localStorage.getItem(cacheKey) || defaultCredits;
                if (creditLabel) creditLabel.textContent = `${cachedCredits}`;
            }

            if (!userMenu && navContainer) {
                userMenu = document.createElement('div');
                userMenu.id = 'userProfileMenu';
                userMenu.className = 'user-profile-menu';
                navContainer.appendChild(userMenu);
            }

            if (userMenu) {
                userMenu.innerHTML = `
                    <button class="user-avatar-btn" id="userAvatarBtn" aria-label="User menu">
                        ${avatarSrc}
                        <span>${displayName}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div class="dropdown-header-info">
                            <div class="dropdown-user-name">${displayName}</div>
                            <div class="dropdown-user-email">${user.email || 'No email provided'}</div>
                        </div>
                        <a href="dashboard.html" onclick="if(window.switchView){ window.switchView('home'); return false; }" class="user-dropdown-item">
                            <span>📊</span> Dashboard
                        </a>
                        <a href="dashboard.html#profile" onclick="if(window.switchView){ window.switchView('profile'); return false; }" class="user-dropdown-item">
                            <span>👤</span> My Profile
                        </a>
                        <button class="user-dropdown-item logout-item" data-auth-logout="true">
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                `;
                userMenu.style.display = 'block';
            }
        } else {
            if (userMenu) userMenu.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (profileBtn) profileBtn.style.display = 'none';
            if (creditToggle) creditToggle.style.display = 'none';
        }
    }

    isLoggedIn() {
        if (localStorage.getItem('scholarly_admin') === 'true') return true;
        if (this.currentUser && (this.currentUser.uid || this.currentUser.email) && !(this.currentUser.uid && this.currentUser.uid.startsWith('demo_'))) return true;
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) return true;
        return false;
    }

    isProfileComplete() {
        if (!this.isLoggedIn()) return false;
        
        // Admin bypass
        if (localStorage.getItem('scholarly_admin') === 'true') return true;
        
        // Check 1: Europass / Student Profile in localStorage
        try {
            const profilesStr = localStorage.getItem('scholarpath_profiles_v2');
            if (profilesStr) {
                const profiles = JSON.parse(profilesStr);
                const keys = Object.keys(profiles);
                if (keys.length > 0) {
                    const active = profiles[keys[0]];
                    // Require actual education details, explicit completion flag, or saved academic data
                    if (active && (
                        (active.educationList && active.educationList.length > 0) || 
                        active.isComplete === true ||
                        (active.savedAt && active.futureFieldOfStudy)
                    )) {
                        return true;
                    }
                }
            }
        } catch (e) {}

        // Check 2: Explicitly saved Matchmaker academic inputs
        const mmCompleted = localStorage.getItem('mm_profile_completed');
        const hssc = localStorage.getItem('mm_hssc');
        const stream = localStorage.getItem('mm_stream');
        if (mmCompleted === 'true' || (hssc && stream && hssc !== '880' && hssc !== 'N/A' && stream !== 'N/A')) {
            return true;
        }

        return false;
    }

    getUserPlan() {
        if (window.AdminModule && window.AdminModule.isAdmin()) return 'owner';
        const savedPlan = localStorage.getItem('scholarly_user_plan');
        if (savedPlan) return savedPlan.toLowerCase();
        if (this.currentUser && this.currentUser.plan) return this.currentUser.plan.toLowerCase();
        return 'free';
    }

    isOwner() {
        if (window.AdminModule && window.AdminModule.isAdmin()) return true;
        const plan = this.getUserPlan();
        if (plan === 'owner' || plan === 'admin') return true;
        if (this.currentUser && (this.currentUser.role === 'owner' || this.currentUser.role === 'admin' || this.currentUser.isOwner)) return true;
        return false;
    }

    deductLocalCredits(amount) {
        if (!this.currentUser) return;
        const uid = this.currentUser.uid || 'demo';
        if (this.isOwner()) return; // Owner doesn't use credits

        const cacheKey = 'scholarly_user_credits_' + uid;
        let current = parseInt(localStorage.getItem(cacheKey));
        if (isNaN(current)) {
            const creditLabel = document.getElementById('creditLabel');
            if (creditLabel && creditLabel.textContent) {
                current = parseInt(creditLabel.textContent);
            }
            if (isNaN(current)) current = 15;
        }
        
        const newCredits = Math.max(0, current - amount);
        localStorage.setItem(cacheKey, newCredits);
        
        const creditLabel = document.getElementById('creditLabel');
        if (creditLabel) creditLabel.textContent = `${newCredits}`;
    }

    requireAuth(featureName = 'this feature', requireProfile = false) {
        if (!this.isLoggedIn()) {
            this.openModal('login', `Please log in or create an account to access ${featureName}.`, 'info');
            return false;
        }

        if (requireProfile && !this.isProfileComplete()) {
            if (window.showToast) {
                window.showToast(`⚠️ Profile Incomplete: Please complete your profile to use ${featureName}.`, 'warning');
            } else {
                alert(`Profile Incomplete: Please complete your profile to use ${featureName}.`);
            }
            if (typeof window.switchView === 'function') {
                window.switchView('profile');
            } else {
                window.location.hash = 'profile';
            }
            return false;
        }

        return true;
    }

    requirePlan(requiredPlan = 'pro', featureName = 'this feature') {
        if (!this.requireAuth(featureName)) return false;
        if (this.isOwner()) return true;

        const currentPlan = this.getUserPlan();
        const hierarchy = { 'free': 1, 'pro': 2, 'premium': 3, 'premier': 3, 'owner': 99 };
        const userLevel = hierarchy[currentPlan] || 1;
        const requiredLevel = hierarchy[requiredPlan.toLowerCase()] || 2;

        if (userLevel < requiredLevel) {
            const reqName = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
            if (window.showToast) {
                window.showToast(`🔒 ${featureName} requires the ${reqName} Tier. Click to upgrade!`, 'info');
            } else {
                alert(`${featureName} requires the ${reqName} Tier. Please upgrade your account to unlock access.`);
            }
            if (typeof window.switchView === 'function') {
                window.switchView('pricing');
            }
            return false;
        }

        return true;
    }

    async getAuthHeaders() {
        let token = 'guest-token';
        if (localStorage.getItem('scholarly_admin') === 'true') {
            token = 'admin-bypass';
        } else if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            try {
                token = await firebase.auth().currentUser.getIdToken();
            } catch (e) {
                console.warn('Failed to get Firebase token, using fallback', e);
            }
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    }
}

// Global Auth Instance
window.ScholarAuth = new AuthController();