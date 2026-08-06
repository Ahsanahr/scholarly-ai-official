/* ============================================
   TRAZO SCHOLARLY — Mobile Experience Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Theme Toggle ────────────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Apply saved theme on load
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // ─── 2. Drawer Toggle (Top Bar Button) ──────────────────
    const drawerToggleBtn = document.getElementById('drawer-toggle');
    const drawer          = document.getElementById('mobile-drawer');
    const drawerOverlay   = document.getElementById('drawer-overlay');

    function openDrawer() {
        if (drawer && drawerOverlay) {
            drawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDrawer() {
        if (drawer && drawerOverlay) {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (drawerToggleBtn) {
        drawerToggleBtn.addEventListener('click', openDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // ─── 3. Swipe to Close Drawer ───────────────────────────
    let touchstartX = 0;
    let touchendX   = 0;

    if (drawer) {
        drawer.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        drawer.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            // Swipe right → close drawer (drawer opens from right)
            if (touchendX > touchstartX + 50) {
                closeDrawer();
            }
        }, { passive: true });
    }

    // ─── 4. Bottom Nav "More" Button (if separate from drawer-toggle) ─
    const bottomMoreBtn = document.getElementById('drawer-toggle-bottom');
    if (bottomMoreBtn) {
        bottomMoreBtn.addEventListener('click', () => {
            if (drawer && drawer.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    // ─── 5. Bottom Nav Active State Persistence ─────────────
    // Set active class on bottom nav items based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
    });

    // ─── 6. Smooth Scroll for anchor links ──────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── 7. Touch ripple effect on interactive elements ─────
    const rippleTargets = document.querySelectorAll(
        '.feature-tile-enhanced, .kpi-card-enhanced, .plan-card, .category-card, .bottom-nav-item'
    );
    rippleTargets.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.opacity = '0.85';
        }, { passive: true });
        el.addEventListener('touchend', () => {
            el.style.opacity = '';
        }, { passive: true });
    });

    // ─── 8. Staggered entrance animations (re-trigger on nav) ─
    const contentChildren = document.querySelectorAll('.mobile-content > *');
    contentChildren.forEach((child, i) => {
        child.style.animationDelay = `${0.05 + i * 0.1}s`;
    });

});
