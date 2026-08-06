/**
 * SCHOLARLY AI - Premium Pricing & Monetization UI Module
 */

class PricingModule {
    constructor() {
        this.currentPeriod = 'monthly'; // 'monthly', 'quarterly', 'yearly'
        this.plans = {
            free: {
                name: "Free Student",
                tagline: "For exploring candidates",
                credits: 15,
                monthly: 0,
                quarterly: 0,
                yearly: 0,
                features: [
                    "15 Credits Balance", 
                    "5 Searches + 1 SOP or 15 Searches", 
                    "Access Universities & Coaching Data", 
                    "Create & Edit Academic Profile"
                ],
                missing: ["Visible Coupon Codes", "Export Profile as CV", "Entry Test MCQs", "AI Match Maker"]
            },
            pro: {
                name: "Pro Explorer",
                tagline: "For active applicants",
                credits: 50,
                monthly: 450,
                quarterly: 1200,
                yearly: 3600,
                features: [
                    "50 Credits Balance", 
                    "Entry Test MCQs Access", 
                    "All Coupon Codes Visible", 
                    "Export Profile as CV (Europass PDF)",
                    "Priority Search & SOP Generation"
                ],
                missing: ["AI Match Maker", "Ahsanullah Consultation Session"]
            },
            premier: {
                name: "Premium Scholar",
                tagline: "The ultimate admission edge",
                credits: 450,
                monthly: 1500,
                quarterly: 3900,
                yearly: 11000,
                features: [
                    "450 Credits Balance", 
                    "Full AI Match Maker Access", 
                    "1 x 30-min Consultation with Ahsanullah (Value 2500 PKR)",
                    "All Pro & Free Tier Features",
                    "Export Profile as CV",
                    "Entry Test MCQs & Coupon Codes"
                ],
                missing: []
            }
        };
    }

    injectStyles() {
        if (!document.getElementById('pricing-styles')) {
            const style = document.createElement('style');
            style.id = 'pricing-styles';
            style.innerHTML = `
                .pricing-container {
                    padding: 60px 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: 'Inter', 'Outfit', sans-serif;
                }
                .pricing-header {
                    text-align: center;
                    margin-bottom: 50px;
                    animation: fadeInDown 0.8s ease-out;
                }
                .pricing-title {
                    font-size: 3rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 15px;
                    letter-spacing: -0.03em;
                }
                .pricing-title span {
                    background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .pricing-subtitle {
                    color: var(--text-secondary);
                    max-width: 650px;
                    margin: 0 auto;
                    font-size: 1.2rem;
                    line-height: 1.6;
                }
                
                /* Toggle Switch */
                .billing-toggle-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-top: 40px;
                    animation: fadeIn 1s ease-out;
                }
                .billing-toggle {
                    display: inline-flex;
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 40px;
                    padding: 6px;
                    position: relative;
                }
                .toggle-btn {
                    padding: 12px 24px;
                    border-radius: 30px;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    z-index: 2;
                }
                .toggle-btn.active {
                    color: white;
                }
                .toggle-slider {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    height: calc(100% - 12px);
                    width: calc(33.33% - 4px);
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    border-radius: 30px;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
                }
                .save-badge {
                    position: absolute;
                    top: -12px;
                    right: -10px;
                    background: #10b981;
                    color: white;
                    font-size: 0.75rem;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 700;
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                    transform: rotate(5deg);
                }

                /* Pricing Grid */
                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    margin-top: 50px;
                    align-items: center;
                }
                
                /* Pricing Card */
                .pricing-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 40px;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    animation: slideUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                .pricing-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    border-color: rgba(255, 255, 255, 0.15);
                }
                .pricing-card.popular {
                    background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                    border: 1px solid rgba(168, 85, 247, 0.4);
                    box-shadow: 0 0 40px rgba(168, 85, 247, 0.15);
                    transform: scale(1.05);
                }
                .pricing-card.popular:hover {
                    transform: scale(1.05) translateY(-10px);
                    box-shadow: 0 15px 50px rgba(168, 85, 247, 0.25);
                }
                .popular-badge {
                    position: absolute;
                    top: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                    color: white;
                    padding: 6px 20px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
                }
                
                /* Card Content */
                .plan-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 5px;
                }
                .plan-tagline {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    margin-bottom: 25px;
                }
                .plan-price-wrapper {
                    display: flex;
                    align-items: baseline;
                    margin-bottom: 30px;
                }
                .plan-price {
                    font-size: 3.5rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    line-height: 1;
                }
                .plan-period {
                    font-size: 1.1rem;
                    color: var(--text-tertiary);
                    margin-left: 8px;
                    font-weight: 500;
                }
                
                /* Features List */
                .feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 35px 0;
                    flex-grow: 1;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    color: var(--text-secondary);
                    font-size: 1.05rem;
                }
                .feature-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    font-size: 0.8rem;
                }
                .feature-icon.missing {
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.3);
                }
                .feature-item.missing {
                    color: var(--text-tertiary);
                    text-decoration: line-through;
                    opacity: 0.6;
                }
                
                /* CTA Button */
                .upgrade-btn {
                    width: 100%;
                    padding: 16px;
                    border-radius: 16px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    position: relative;
                    overflow: hidden;
                }
                .upgrade-btn.primary {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    color: white;
                    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
                }
                .upgrade-btn.primary:hover {
                    box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4);
                    transform: translateY(-2px);
                }
                .upgrade-btn.primary::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: all 0.6s ease;
                }
                .upgrade-btn.primary:hover::after {
                    left: 100%;
                }
                .upgrade-btn.secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .upgrade-btn.secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 900px) {
                    .pricing-grid {
                        grid-template-columns: 1fr;
                        max-width: 450px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .pricing-card.popular {
                        transform: scale(1);
                    }
                    .pricing-card.popular:hover {
                        transform: translateY(-5px);
                    }
                    .toggle-btn {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                    .pricing-title {
                        font-size: 2.2rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    render() {
        this.injectStyles();
        const container = document.getElementById('pricingContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="pricing-container">
                <div class="pricing-header">
                    <h2 class="pricing-title">
                        Unlock Your <span>True Potential</span>
                    </h2>
                    <p class="pricing-subtitle">
                        Choose the perfect plan to turbocharge your university applications, unlock AI-driven matchmaker insights, and master your SOPs.
                    </p>
                    
                    <div class="billing-toggle-wrapper">
                        <div class="billing-toggle">
                            <div class="toggle-slider" id="pricingSlider"></div>
                            <button class="toggle-btn active" data-period="monthly" onclick="window.pricingModule.setPeriod('monthly')">Monthly</button>
                            <button class="toggle-btn" data-period="quarterly" onclick="window.pricingModule.setPeriod('quarterly')" style="position:relative;">
                                3 Months
                                <span class="save-badge">Save 10%</span>
                            </button>
                            <button class="toggle-btn" data-period="yearly" onclick="window.pricingModule.setPeriod('yearly')" style="position:relative;">
                                1 Year
                                <span class="save-badge">Save 33%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="pricing-grid">
                    ${this.renderPlan('free', 0.1)}
                    ${this.renderPlan('premier', 0.3, true)}
                    ${this.renderPlan('pro', 0.2)}
                </div>
            </div>
        `;
        
        // Initial setup for the slider position
        setTimeout(() => this.updateSliderPosition(), 50);
    }

    renderPlan(key, delayDelay, isPopular = false) {
        const plan = this.plans[key];
        const price = plan[this.currentPeriod];
        let priceStr = price === 0 ? "Free" : `Rs. ${price.toLocaleString()}`;
        
        let periodSuffix = '';
        if (price > 0) {
            periodSuffix = this.currentPeriod === 'monthly' ? '/ mo' : this.currentPeriod === 'quarterly' ? '/ 3mo' : '/ yr';
        }

        const featuresHtml = plan.features.map(f => `
            <li class="feature-item">
                <div class="feature-icon"><i class="fas fa-check"></i></div> 
                ${f}
            </li>
        `).join('');

        const missingHtml = plan.missing.map(m => `
            <li class="feature-item missing">
                <div class="feature-icon missing"><i class="fas fa-times"></i></div> 
                ${m}
            </li>
        `).join('');
        
        return `
            <div class="pricing-card ${isPopular ? 'popular' : ''}" style="animation-delay: ${delayDelay}s;">
                ${isPopular ? `<div class="popular-badge">RECOMMENDED</div>` : ''}
                
                <h3 class="plan-name">${plan.name}</h3>
                <p class="plan-tagline">${plan.tagline}</p>
                
                <div class="plan-price-wrapper">
                    <div class="plan-price" id="price-${key}">${priceStr}</div>
                    <div class="plan-period">${periodSuffix}</div>
                </div>
                
                <ul class="feature-list">
                    ${featuresHtml}
                    ${missingHtml}
                </ul>

                <button onclick="window.pricingModule.checkout('${key}')" class="upgrade-btn ${isPopular ? 'primary' : 'secondary'}">
                    ${price === 0 ? 'Current Plan' : 'Upgrade to ' + plan.name}
                </button>
            </div>
        `;
    }

    updateSliderPosition() {
        const slider = document.getElementById('pricingSlider');
        if (!slider) return;
        
        if (this.currentPeriod === 'monthly') {
            slider.style.transform = 'translateX(0)';
        } else if (this.currentPeriod === 'quarterly') {
            slider.style.transform = 'translateX(100%)';
        } else if (this.currentPeriod === 'yearly') {
            slider.style.transform = 'translateX(200%)';
        }
    }

    setPeriod(period) {
        this.currentPeriod = period;
        
        // Update toggle UI text color
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.updateSliderPosition();

        // Update prices smoothly
        ['free', 'pro', 'premier'].forEach(key => {
            const plan = this.plans[key];
            const price = plan[period];
            const priceEl = document.getElementById(`price-${key}`);
            if (priceEl) {
                // Fade out, change, fade in
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.textContent = price === 0 ? "Free" : `Rs. ${price.toLocaleString()}`;
                    priceEl.style.opacity = '1';
                    
                    // Also update suffix
                    const periodEl = priceEl.nextElementSibling;
                    if (periodEl) {
                        periodEl.textContent = price > 0 ? (period === 'monthly' ? '/ mo' : period === 'quarterly' ? '/ 3mo' : '/ yr') : '';
                    }
                }, 200);
            }
        });
    }

    async checkout(planKey) {
        if (planKey === 'free') return;
        
        if (!window.ScholarAuth || !window.ScholarAuth.isLoggedIn()) {
            if (window.showToast) window.showToast('Please sign in to upgrade.', 'warning');
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.style.display = 'flex';
                setTimeout(() => authModal.style.opacity = '1', 10);
            }
            return;
        }

        try {
            const plan = this.plans[planKey];
            const price = plan[this.currentPeriod];
            
            // Fetch Firebase ID token using AuthController utility
            let token = 'demo_token';
            if (window.ScholarAuth) {
                try {
                    const headers = await window.ScholarAuth.getAuthHeaders();
                    if (headers && headers['Authorization']) {
                        token = headers['Authorization'].replace('Bearer ', '');
                    }
                } catch (e) {
                    console.warn('Failed to fetch auth headers, using demo_token:', e);
                }
            }
            localStorage.setItem('temp_checkout_token', token);
            
            // Redirect directly to the payment gateway like the landing page does
            window.location.href = `payment-gateway.html?plan=${planKey}&amount=${price}`;
        } catch (error) {
            if (window.showToast) window.showToast(error.message, 'error');
            console.error('Checkout error:', error);
        }
    }
}

// Initialize globally
window.pricingModule = new PricingModule();

// Render when DOM is ready or already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pricingModule.render();
    });
} else {
    window.pricingModule.render();
}
