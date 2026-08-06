/**
 * SCHOLARLY AI — Central Dashboard Controller & View Switcher
 * Manages 11 modular views, sidebar navigation, topbar global search, API config modal triggers, and toast notifications.
 */

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

/* ===== State ===== */
let currentView = 'home';

/* ===== Initialization ===== */
function initDashboard() {
    initSidebar();
    initGlobalSearch();

    // Hash routing support on load
    setTimeout(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            switchView(hash);
        }
    }, 100);

    // Initialize module renderers
    if (window.docChecklistInstance) {
        window.docChecklistInstance.render('documentsContainer');
    }
    if (window.TestPrepModule) {
        window.TestPrepModule.render('testPrepContainer');
    }
    if (window.TimelineModule) {
        window.TimelineModule.render('timelineContainer');
    }
    if (window.ArticlesModule) {
        window.ArticlesModule.render('articlesContainer');
    }
    if (window.ConsultantsModule) {
        window.ConsultantsModule.render('consultantsContainer');
    }
    if (window.MatchmakerModule) {
        window.MatchmakerModule.render('matchmakerContainer');
    }
    if (window.UniversitiesModule) {
        window.UniversitiesModule.render('universitiesContainer');
    }
    if (window.ScholarshipsModule) {
        window.ScholarshipsModule.render('scholarshipsContainer');
    }
    if (window.AggregateCalculator) {
        const calc = new window.AggregateCalculator();
        calc.renderCalculator('calculatorContainer');
    }
    if (window.StudentProfile) {
        const profile = new window.StudentProfile();
        profile.render('profileContainer');
    }
    if (window.SOPEditor) {
        const sop = new window.SOPEditor();
        sop.render('sopContainer');
    }
}

/* ===== View Switching Engine ===== */
function switchView(viewId) {
    // Normalize aliases
    if (viewId === 'dashboard') viewId = 'home';
    if (viewId === 'ai-search') viewId = 'search';
    if (viewId === 'sop-studio') viewId = 'sop';
    if (viewId === 'profile-cv') viewId = 'profile';

    let isRoi = false;
    if (viewId === 'roi-calculator') {
        viewId = 'study-abroad';
        isRoi = true;
    }

    // Enforce Auth for all protected views
    const publicViews = ['home', 'pricing', 'admin'];
    if (!publicViews.includes(viewId)) {
        // Special label formatting for auth popup
        const viewLabels = {
            'search': 'Search Engine',
            'universities': 'Universities Database',
            'scholarships': 'Scholarships Database',
            'programs': 'Programs Database',
            'test-prep': 'Entry Test Prep',
            'documents': 'Document Locker',
            'sop': 'SOP Editor',
            'matchmaker': 'Smart Profile Matchmaker',
            'profile': 'Profile & CV Exporter',
            'calculator': 'Merit Calculator',
            'timeline': 'Timeline',
            'consultants': 'Consultants Hub',
            'articles': 'Articles',
            'study-abroad': 'Study Abroad & ROI'
        };
        const featureName = viewLabels[viewId] || 'this feature';
        
        // Matchmaker also requires profile
        const requiresProfile = (viewId === 'matchmaker');
        
        if (window.ScholarAuth && !window.ScholarAuth.requireAuth(featureName, requiresProfile)) {
            return;
        }
    }

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target view
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active');
        if (isRoi && window.showStudyAbroadTool) {
            window.showStudyAbroadTool('roi');
        }
    }

    // Update sidebar links active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewId);
    });

    // Update Header Titles
    const titles = {
        home: ['Main Dashboard', 'Welcome back. Here is your academic status summary.'],
        search: ['AI Search & Research', 'Instant grounded academic answers'],
        timeline: ['Saved Timeline & Schedule', 'Interactive calendar plotting test dates, admissions & scholarships'],
        universities: ['Universities & Merit Hub', 'Explore closing merit trends, composite weightage rules & portals'],
        articles: ['Community Articles & Experience Wall', 'Real hostel reviews, scholarship interviews, and entry test tips'],
        'test-prep': ['Entry Test Prep & Past Papers Vault', 'Preparation workstation & downloadable past papers repository'],
        documents: ['Documents Locker & 5 Practical Guides', 'Digital document manager with status tags & Pakistani procedural guides'],
        sop: ['SOP & Essay Refine Studio', 'Interactive AI essay editor and feedback analyzer'],
        consultants: ['Consultant Desk & Discount Codes', 'Verified educational advisors with platform discount coupons'],
        matchmaker: ['Smart Profile Matchmaker', 'Calculate your admission & scholarship Match Confidence Score (%)'],
        scholarships: ['Scholarships Hub', 'Search national and international financial aid opportunities'],
        profile: ['Gamified Profile & Europass CV Exporter', 'Build your profile & export clean Europass CV PDFs'],
        calculator: ['Merit Calculator', 'Calculate your exact composite percentage'],
        pricing: ['Scholarly Credits & Plans', 'Choose a plan to upgrade your credit balance'],
        admin: ['Users', 'Manage registered users and account plans']
    };

    const [title, subtitle] = titles[viewId] || ['SCHOLARLY AI', ''];
    const pTitle = document.getElementById('pageTitle');
    const pSub = document.getElementById('pageSubtitle');
    if (pTitle) pTitle.textContent = title;
    if (pSub) pSub.textContent = subtitle;

    currentView = viewId;
    closeSidebar();

    // Trigger specific module render on view switch if needed
    if (viewId === 'test-prep' && window.TestPrepModule) window.TestPrepModule.render('testPrepContainer');
    if (viewId === 'documents' && window.docChecklistInstance) window.docChecklistInstance.render('documentsContainer');
    if (viewId === 'timeline' && window.TimelineModule) window.TimelineModule.render('timelineContainer');
    if (viewId === 'articles' && window.ArticlesModule) window.ArticlesModule.render('articlesContainer');
    if (viewId === 'consultants' && window.ConsultantsModule) window.ConsultantsModule.render('consultantsContainer');
    if (viewId === 'matchmaker' && window.MatchmakerModule) window.MatchmakerModule.render('matchmakerContainer');
    if (viewId === 'universities' && window.UniversitiesModule) window.UniversitiesModule.render('universitiesContainer');
    if (viewId === 'scholarships' && window.ScholarshipsModule) window.ScholarshipsModule.render('scholarshipsContainer');
    if (viewId === 'admin' && window.AdminModule) window.AdminModule.renderDashboard('adminDashboardContainer');
}

window.switchView = switchView;

/* ===== Sidebar & Mobile Drawer ===== */
function initSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar?.classList.toggle('open');
            overlay?.classList.toggle('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
}

function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
}

/* ===== Global Search Bar ===== */
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    switchView('search');
                    const aiInput = document.getElementById('aiSearchInput');
                    if (aiInput) aiInput.value = query;
                }
            }
        });
    });
}

/* ===== Toast Notification Utility ===== */
window.showToast = function(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px;';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: var(--bg-surface);
        border: 1px solid ${type === 'success' ? 'var(--status-success)' : type === 'info' ? 'var(--accent-primary)' : 'var(--status-warning)'};
        color: var(--text-primary);
        padding: 12px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeIn 0.3s ease;
    `;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️'}</span> <div>${message}</div>`;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};
