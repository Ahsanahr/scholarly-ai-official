/**
 * SCHOLARLY AI - ROI Calculator Logic
 */

function initROICalculator() {
    const countryEl = document.getElementById('roi-country');
    const degreeEl = document.getElementById('roi-degree');
    const fieldEl = document.getElementById('roi-field');
    
    if (countryEl && degreeEl && fieldEl) {
        countryEl.addEventListener('change', calculateROI);
        degreeEl.addEventListener('change', calculateROI);
        fieldEl.addEventListener('change', calculateROI);
        // Initial calculation
        calculateROI();
    }
}

function calculateROI() {
    const countryEl = document.getElementById('roi-country');
    if (!countryEl) return;
    
    const country = countryEl.value;
    const degree = document.getElementById('roi-degree').value;
    const field = document.getElementById('roi-field').value;

    // Define base data (averages in USD)
    const costs = {
        usa: { tuitionPerYear: 35000, livingPerYear: 18000 },
        uk: { tuitionPerYear: 22000, livingPerYear: 15000 },
        australia: { tuitionPerYear: 26000, livingPerYear: 16000 },
        canada: { tuitionPerYear: 20000, livingPerYear: 12000 }
    };
    
    const salaryMultipliers = {
        usa: 1.0, uk: 0.7, australia: 0.8, canada: 0.75
    };

    const baseSalaries = {
        cs: 85000, engineering: 75000, business: 65000, arts: 45000
    };

    const years = degree === 'bachelors' ? 4 : 2;
    
    const countryCost = costs[country] || costs['usa'];
    const totalTuition = countryCost.tuitionPerYear * years;
    const totalLiving = countryCost.livingPerYear * years;
    const totalCost = totalTuition + totalLiving;

    // Masters degree adds a premium to starting salary
    const degreeMultiplier = degree === 'masters' ? 1.25 : 1.0;
    
    const annualSalary = (baseSalaries[field] || baseSalaries['cs']) * (salaryMultipliers[country] || 1.0) * degreeMultiplier;
    
    // Assuming 30% of salary goes to paying back the cost
    const annualPayback = annualSalary * 0.30;
    const breakEvenYears = (totalCost / annualPayback).toFixed(1);

    // Update UI
    document.getElementById('roi-total-cost').innerText = '$' + totalCost.toLocaleString();
    document.getElementById('roi-tuition-breakdown').innerText = 'Tuition: $' + totalTuition.toLocaleString();
    document.getElementById('roi-living-breakdown').innerText = 'Living: $' + totalLiving.toLocaleString();
    document.getElementById('roi-annual-salary').innerText = '$' + Math.round(annualSalary).toLocaleString();
    document.getElementById('roi-break-even').innerText = breakEvenYears + ' Years';

    const bar = document.getElementById('roi-progress-bar');
    const verdict = document.getElementById('roi-verdict');
    
    let progress = 0;
    if (breakEvenYears <= 3.5) {
        progress = 100;
        bar.style.background = 'var(--status-success)';
        verdict.innerText = 'Excellent ROI! Fast recovery of investment.';
        verdict.style.color = 'var(--status-success)';
    } else if (breakEvenYears <= 6) {
        progress = 65;
        bar.style.background = 'var(--status-warning)';
        verdict.innerText = 'Good ROI. Standard recovery period.';
        verdict.style.color = 'var(--status-warning)';
    } else {
        progress = 35;
        bar.style.background = 'var(--status-danger)';
        verdict.innerText = 'Low ROI. Consider scholarships or part-time work.';
        verdict.style.color = 'var(--status-danger)';
    }
    bar.style.width = progress + '%';
}

// Automatically initialize when loaded
document.addEventListener('DOMContentLoaded', initROICalculator);
// Also try immediately in case DOMContentLoaded already fired
initROICalculator();
