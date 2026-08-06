/**
 * ScholarPath AI — Landing Page JavaScript
 * Handles: Navigation, scroll effects, search, stat counters, reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSearch();
    initStatCounters();
    initRevealAnimations();
    initSuggestionChips();
});

/* ---------- Navigation ---------- */
function initNav() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });

        // Close on link click
        links.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ---------- Hero Search ---------- */
function initSearch() {
    const input = document.getElementById('heroSearchInput');
    const btn = document.getElementById('heroSearchBtn');

    if (!input || !btn) return;

    const performSearch = () => {
        const query = input.value.trim();
        if (query) {
            // Navigate to dashboard with search query
            window.location.href = `dashboard.html?q=${encodeURIComponent(query)}`;
        }
    };

    btn.addEventListener('click', performSearch);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Focus effect
    input.addEventListener('focus', () => {
        input.closest('.hero-search').classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.closest('.hero-search').classList.remove('focused');
    });
}

/* ---------- Suggestion Chips ---------- */
function initSuggestionChips() {
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            if (query) {
                window.location.href = `dashboard.html?q=${encodeURIComponent(query)}`;
            }
        });
    });
}

/* ---------- Animated Stat Counters ---------- */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ---------- Intersection Observer Reveal ---------- */
function initRevealAnimations() {
    const elements = document.querySelectorAll('.feature-card, .step-card, .cta-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animation = 'slideUp 0.5s ease both';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${i * 0.08}s`;
        observer.observe(el);
    });
}

let currentLandingPeriod = 'monthly';
let currentLandingDiscount = 0; // 0 = 0%, 0.20 = 20%, etc.
let activeCouponCode = '';

const COUPON_DATABASE = {
    'SCHOLAR20': { discount: 0.20, label: '20% OFF' },
    'WELCOME20': { discount: 0.20, label: '20% OFF' },
    'PROMO50':   { discount: 0.50, label: '50% OFF' },
    'STUDENT50': { discount: 0.50, label: '50% OFF' },
    'EARLYBIRD': { discount: 0.30, label: '30% OFF' },
    'AHSAN100':  { discount: 1.00, label: '100% FREE (100% OFF)' },
    'FREEPRO':   { discount: 1.00, label: '100% FREE (100% OFF)' },
};

window.applyLandingCoupon = function() {
    const input = document.getElementById('landingCouponInput');
    const status = document.getElementById('landingCouponStatus');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        if (status) {
            status.style.display = 'block';
            status.style.color = '#ef4444';
            status.textContent = '⚠️ Please enter a coupon code.';
        }
        return;
    }

    if (COUPON_DATABASE[code]) {
        currentLandingDiscount = COUPON_DATABASE[code].discount;
        activeCouponCode = code;
        if (status) {
            status.style.display = 'block';
            status.style.color = '#10b981';
            status.textContent = `✅ Coupon '${code}' Applied! You saved ${COUPON_DATABASE[code].label}.`;
        }
    } else {
        if (status) {
            status.style.display = 'block';
            status.style.color = '#ef4444';
            status.textContent = `❌ Invalid coupon code '${code}'. Try SCHOLAR20 or PROMO50!`;
        }
        return;
    }

    window.toggleBillingPeriod(currentLandingPeriod);
};

window.applyQuickCoupon = function(code) {
    const input = document.getElementById('landingCouponInput');
    if (input) input.value = code;
    window.applyLandingCoupon();
};

/* ---------- Landing Pricing Toggle ---------- */
window.toggleBillingPeriod = function(period) {
    currentLandingPeriod = period || currentLandingPeriod;

    const btnMonthly = document.getElementById('btnMonthly');
    const btnQuarterly = document.getElementById('btnQuarterly');
    const btnYearly = document.getElementById('btnYearly');

    [btnMonthly, btnQuarterly, btnYearly].forEach(btn => btn?.classList.remove('active'));

    const proVal = document.getElementById('proPriceValue');
    const proPeriod = document.getElementById('proPricePeriod');
    const proBtn = document.getElementById('proCheckoutBtn');

    const premierVal = document.getElementById('premierPriceValue');
    const premierPeriod = document.getElementById('premierPricePeriod');
    const premierBtn = document.getElementById('premierCheckoutBtn');

    let basePro = 450;
    let basePremier = 1500;
    let periodSuffix = '/ mo';

    if (currentLandingPeriod === 'monthly') {
        if (btnMonthly) btnMonthly.classList.add('active');
        basePro = 450;
        basePremier = 1500;
        periodSuffix = '/ mo';
    } else if (currentLandingPeriod === 'quarterly') {
        if (btnQuarterly) btnQuarterly.classList.add('active');
        basePro = 1200;
        basePremier = 3900;
        periodSuffix = '/ 3mo';
    } else if (currentLandingPeriod === 'yearly') {
        if (btnYearly) btnYearly.classList.add('active');
        basePro = 3600;
        basePremier = 11000;
        periodSuffix = '/ yr';
    }

    // Apply discount if active
    const finalPro = Math.round(basePro * (1 - currentLandingDiscount));
    const finalPremier = Math.round(basePremier * (1 - currentLandingDiscount));

    if (proVal) {
        if (currentLandingDiscount > 0) {
            proVal.innerHTML = `<span style="text-decoration:line-through; opacity:0.5; font-size:0.8em; margin-right:4px;">${basePro}</span> ${finalPro}`;
        } else {
            proVal.textContent = basePro.toLocaleString();
        }
    }
    if (proPeriod) proPeriod.textContent = periodSuffix;
    if (proBtn) {
        let url = `payment-gateway.html?plan=pro&amount=${finalPro}&period=${currentLandingPeriod}`;
        if (activeCouponCode) url += `&coupon=${activeCouponCode}`;
        proBtn.href = url;
    }

    if (premierVal) {
        if (currentLandingDiscount > 0) {
            premierVal.innerHTML = `<span style="text-decoration:line-through; opacity:0.5; font-size:0.8em; margin-right:4px;">${basePremier.toLocaleString()}</span> ${finalPremier.toLocaleString()}`;
        } else {
            premierVal.textContent = basePremier.toLocaleString();
        }
    }
    if (premierPeriod) premierPeriod.textContent = periodSuffix;
    if (premierBtn) {
        let url = `payment-gateway.html?plan=premier&amount=${finalPremier}&period=${currentLandingPeriod}`;
        if (activeCouponCode) url += `&coupon=${activeCouponCode}`;
        premierBtn.href = url;
    }
};

