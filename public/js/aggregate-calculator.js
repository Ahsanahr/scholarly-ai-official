/* ============================================
   ScholarPath AI — Aggregate / Merit Calculator
   Pakistani University Admissions Formulas
   ============================================ */

;(function () {
  'use strict';

  /* ────────────────────────────────────────────
     Constants & Storage Key
     ──────────────────────────────────────────── */
  const LS_KEY = 'scholarpath_calc_scores';

  /* ────────────────────────────────────────────
     University Definitions
     Each entry includes the formula, max marks
     for every component, and metadata.
     ──────────────────────────────────────────── */
  const UNIVERSITIES = [
    {
      id: 'nust',
      name: 'National University of Sciences & Technology',
      shortName: 'NUST',
      logo: '🏛️',
      formulaDesc: '(Matric% × 0.15) + (FSc% × 0.25) + (NET% × 0.60)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'net',    label: 'NET Score',  max: 200,  step: 1 }
      ],
      weights: { matric: 0.15, fsc: 0.25, net: 0.60 },
      /** @param {Object} s  — raw scores */
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        const np = (s.net    / 200)  * 100;
        return mp * 0.15 + fp * 0.25 + np * 0.60;
      }
    },
    {
      id: 'fast',
      name: 'FAST – National University (NUCES)',
      shortName: 'FAST-NUCES',
      logo: '⚡',
      formulaDesc: '(Matric% × 0.10) + (FSc% × 0.40) + (NU-TEST × 0.50)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'nu_test', label: 'NU-TEST Score', max: 100,  step: 1 }
      ],
      weights: { matric: 0.10, fsc: 0.40, nu_test: 0.50 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        return mp * 0.10 + fp * 0.40 + s.nu_test * 0.50;
      }
    },
    {
      id: 'giki',
      name: 'Ghulam Ishaq Khan Institute',
      shortName: 'GIKI',
      logo: '🔬',
      formulaDesc: '(Matric% × 0.15) + (GIKI-Test × 0.85)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'giki_test', label: 'GIKI Test Score', max: 100,  step: 1 }
      ],
      weights: { matric: 0.15, giki_test: 0.85 },
      calc(s) {
        const mp = s.matric;
        return mp * 0.15 + s.giki_test * 0.85;
      }
    },
    {
      id: 'comsats',
      name: 'COMSATS University Islamabad',
      shortName: 'COMSATS',
      logo: '💻',
      formulaDesc: '(Matric% × 0.10) + (FSc% × 0.40) + (NTS × 0.50)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'nts',    label: 'NTS Score',    max: 100,  step: 1 }
      ],
      weights: { matric: 0.10, fsc: 0.40, nts: 0.50 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        return mp * 0.10 + fp * 0.40 + s.nts * 0.50;
      }
    },
    {
      id: 'uet',
      name: 'University of Engineering & Technology Lahore',
      shortName: 'UET Lahore',
      logo: '🏗️',
      formulaDesc: '(Matric% × 0.17) + (FSc% × 0.50) + (ECAT% × 0.33)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'ecat', label: 'ECAT Score',   max: 400,  step: 1 }
      ],
      weights: { matric: 0.17, fsc: 0.50, ecat: 0.33 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        const ep = (s.ecat / 400)  * 100;
        return mp * 0.17 + fp * 0.50 + ep * 0.33;
      }
    },
    {
      id: 'pieas',
      name: 'Pakistan Institute of Engineering & Applied Sciences',
      shortName: 'PIEAS',
      logo: '⚛️',
      formulaDesc: '(FSc% × 0.25) + (Written Test × 0.75)',
      fields: [
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'written_test', label: 'Written Test Score', max: 100,  step: 1 }
      ],
      weights: { fsc: 0.25, written_test: 0.75 },
      calc(s) {
        const fp = s.fsc;
        return fp * 0.25 + s.written_test * 0.75;
      }
    },
    {
      id: 'lums',
      name: 'Lahore University of Management Sciences',
      shortName: 'LUMS',
      logo: '🎓',
      formulaDesc: '(SAT% × 0.50) + (Academic% × 0.50)  — holistic review also applies',
      fields: [
        { key: 'sat',      label: 'SAT Score',          max: 1600, step: 10 },
        { key: 'academic', label: 'Academic % (HSC/A-Levels)', max: 100, step: 1 }
      ],
      weights: { sat: 0.50, academic: 0.50 },
      calc(s) {
        const sp = (s.sat / 1600) * 100;
        return sp * 0.50 + s.academic * 0.50;
      }
    },
    {
      id: 'nust_mbbs',
      name: 'NUST — Army Medical College (MBBS)',
      shortName: 'NUST MBBS',
      logo: '🩺',
      formulaDesc: '(Matric% × 0.10) + (FSc% × 0.40) + (MDCAT% × 0.50)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'mdcat',  label: 'MDCAT Score',  max: 210,  step: 1 }
      ],
      weights: { matric: 0.10, fsc: 0.40, mdcat: 0.50 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        const dp = (s.mdcat  / 210)  * 100;
        return mp * 0.10 + fp * 0.40 + dp * 0.50;
      }
    },
    {
      id: 'pu',
      name: 'University of the Punjab',
      shortName: 'PU Lahore',
      logo: '🏛️',
      formulaDesc: '(Academic% × 0.70) + (PU Test% × 0.30)',
      fields: [
        { key: 'academic', label: 'Academic (Matric/FSc)', max: 100, step: 1 },
        { key: 'pu_test',  label: 'PU Admission Test',  max: 100,  step: 1 }
      ],
      weights: { academic: 0.70, pu_test: 0.30 },
      calc(s) {
        return s.academic * 0.70 + s.pu_test * 0.30;
      }
    },
    {
      id: 'gcu',
      name: 'Government College University Lahore',
      shortName: 'GCU',
      logo: '🏰',
      formulaDesc: '(Academic% × 0.70) + (GCU Test% × 0.30)',
      fields: [
        { key: 'academic', label: 'Academic Marks %', max: 100, step: 1 },
        { key: 'gcu_test', label: 'GCU Test Score',   max: 100, step: 1 }
      ],
      weights: { academic: 0.70, gcu_test: 0.30 },
      calc(s) {
        return s.academic * 0.70 + s.gcu_test * 0.30;
      }
    },
    {
      id: 'ned',
      name: 'NED University of Engineering and Technology',
      shortName: 'NED UET',
      logo: '⚙️',
      formulaDesc: '(HSSC% × 0.50) + (NED Test% × 0.50)',
      fields: [
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'ned_test', label: 'NED Entry Test',   max: 100,  step: 1 }
      ],
      weights: { fsc: 0.50, ned_test: 0.50 },
      calc(s) {
        const fp = s.fsc;
        return fp * 0.50 + s.ned_test * 0.50;
      }
    },
    {
      id: 'qau',
      name: 'Quaid-i-Azam University',
      shortName: 'QAU',
      logo: '🌐',
      formulaDesc: '(Matric% × 0.30) + (HSSC% × 0.70)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 }
      ],
      weights: { matric: 0.30, fsc: 0.70 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        return mp * 0.30 + fp * 0.70;
      }
    },
    {
      id: 'itu',
      name: 'Information Technology University',
      shortName: 'ITU',
      logo: '💻',
      formulaDesc: '(Matric% × 0.10) + (HSSC% × 0.40) + (ITU Test% × 0.50)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'itu_test', label: 'ITU Test Score',   max: 100,  step: 1 }
      ],
      weights: { matric: 0.10, fsc: 0.40, itu_test: 0.50 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        return mp * 0.10 + fp * 0.40 + s.itu_test * 0.50;
      }
    },
    {
      id: 'uaf',
      name: 'University of Agriculture Faisalabad',
      shortName: 'UAF',
      logo: '🌾',
      formulaDesc: '(Academic% × 0.70) + (UAF Test% × 0.30)',
      fields: [
        { key: 'academic', label: 'Academic Marks %', max: 100, step: 1 },
        { key: 'uaf_test', label: 'UAF Test Score',   max: 100, step: 1 }
      ],
      weights: { academic: 0.70, uaf_test: 0.30 },
      calc(s) {
        return s.academic * 0.70 + s.uaf_test * 0.30;
      }
    },
    {
      id: 'air',
      name: 'Air University',
      shortName: 'Air Uni',
      logo: '✈️',
      formulaDesc: '(Matric% × 0.15) + (HSSC% × 0.35) + (AU Test% × 0.50)',
      fields: [
        { key: 'matric', label: 'Matric / O-Level (%)', max: 100, step: 0.01 },
        { key: 'fsc', label: 'FSc / A-Level (%)', max: 100, step: 0.01 },
        { key: 'au_test', label: 'AU Test Score',    max: 100,  step: 1 }
      ],
      weights: { matric: 0.15, fsc: 0.35, au_test: 0.50 },
      calc(s) {
        const mp = s.matric;
        const fp = s.fsc;
        return mp * 0.15 + fp * 0.35 + s.au_test * 0.50;
      }
    }
  ];

  /* ────────────────────────────────────────────
     Historical Closing Merit Data
     Approximate merits for last 3 years
     (index 0 = oldest, 2 = most recent)
     ──────────────────────────────────────────── */
  const HISTORICAL_MERITS = {
    nust: {
      CS:  [78.5, 79.2, 80.1],
      EE:  [73.2, 74.5, 75.8],
      ME:  [70.1, 71.3, 72.0],
      CE:  [68.5, 69.8, 71.2],
      BBA: [75.0, 76.5, 77.3]
    },
    fast: {
      CS:  [72.0, 73.5, 74.2],
      EE:  [65.0, 66.2, 67.5],
      SE:  [70.5, 71.8, 72.6],
      BBA: [62.0, 63.5, 64.8]
    },
    giki: {
      Engineering: [74.0, 75.5, 76.8],
      CS:          [76.2, 77.8, 79.0],
      EE:          [71.5, 72.9, 73.6]
    },
    comsats: {
      CS:  [64.0, 65.5, 66.8],
      EE:  [58.5, 60.0, 61.2],
      SE:  [62.0, 63.2, 64.5],
      BBA: [55.0, 56.8, 58.0]
    },
    uet: {
      CS:     [82.0, 83.5, 84.2],
      EE:     [78.0, 79.5, 80.8],
      ME:     [75.5, 77.0, 78.2],
      Civil:  [72.0, 73.5, 74.8]
    },
    pieas: {
      CS:      [80.0, 81.5, 82.3],
      EE:      [77.0, 78.2, 79.5],
      ME:      [74.5, 76.0, 77.2],
      Nuclear: [82.5, 83.8, 85.0]
    },
    lums: {
      CS:   [78.0, 79.5, 80.5],
      BBA:  [76.0, 77.8, 78.5],
      BSc:  [72.0, 73.5, 74.0],
      Law:  [74.5, 76.0, 77.0]
    },
    nust_mbbs: {
      MBBS: [88.0, 89.2, 90.5],
      BDS:  [82.0, 83.5, 84.8]
    },
    pu: {
      CS: [80.5, 81.2, 82.0],
      BBA: [78.0, 79.5, 80.2],
      Law: [79.0, 80.1, 81.5]
    },
    gcu: {
      CS: [75.0, 76.5, 78.0],
      BSc: [72.0, 73.5, 74.8]
    },
    ned: {
      CS: [82.0, 83.5, 84.8],
      EE: [78.5, 79.8, 81.0],
      Civil: [74.0, 75.5, 76.2]
    },
    qau: {
      CS: [85.0, 86.5, 87.2],
      BS_Physics: [82.0, 83.2, 84.5]
    },
    itu: {
      CS: [81.0, 82.5, 83.8],
      SE: [79.5, 80.8, 81.5]
    },
    uaf: {
      BSc_Hons: [70.0, 71.5, 72.8],
      DVM: [78.0, 79.2, 80.5]
    },
    air: {
      CS: [73.5, 75.0, 76.2],
      Cyber_Security: [75.0, 76.8, 78.5]
    }
  };

  /* ────────────────────────────────────────────
     Helper — clamp a number
     ──────────────────────────────────────────── */
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ────────────────────────────────────────────
     Helper — save / load localStorage
     ──────────────────────────────────────────── */
  function saveScores(uniId, scores) {
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      all[uniId] = scores;
      localStorage.setItem(LS_KEY, JSON.stringify(all));
    } catch (_) { /* silent */ }
  }

  function loadScores(uniId) {
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      const saved = all[uniId] || {};
      
      // Fallback to profile data if field is missing
      const profileStr = localStorage.getItem('scholarpath_profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        const t = profile.testScores || {};
        const profileMapping = {
          matric: profile.matricMarks,
          fsc: profile.interMarks,
          net: t.net,
          nu_test: t.nuTest,
          giki_test: t.giki,
          nts: t.nts,
          ecat: t.ecat,
          mdcat: t.mdcat,
          sat: t.sat,
          academic: profile.interMarks,
          pu_test: t.pu_test,
          gcu_test: t.gcu_test,
          ned_test: t.ned_test,
          itu_test: t.itu_test,
          uaf_test: t.uaf_test,
          au_test: t.au_test
        };
        for (const [key, val] of Object.entries(profileMapping)) {
          if (val && saved[key] == null) {
             saved[key] = Number(val);
          }
        }
      }
      return Object.keys(saved).length > 0 ? saved : null;
    } catch (_) { return null; }
  }

  /* ════════════════════════════════════════════
     AggregateCalculator  — Public API
     ════════════════════════════════════════════ */
  class AggregateCalculator {

    /* ── getUniversities ─────────────────────── */
    /** Returns lightweight university metadata */
    getUniversities() {
      return UNIVERSITIES.map(u => ({
        id:          u.id,
        name:        u.name,
        shortName:   u.shortName,
        logo:        u.logo,
        formulaDesc: u.formulaDesc
      }));
    }

    /* ── getRequiredFields ────────────────────── */
    /** Returns an array of { key, label, max, step } for a given university */
    getRequiredFields(universityId) {
      const uni = UNIVERSITIES.find(u => u.id === universityId);
      if (!uni) return [];
      return uni.fields.map(f => ({ ...f }));
    }

    /* ── calculate ───────────────────────────── */
    /**
     * @param  {string} universityId
     * @param  {Object} scores — e.g. { matric: 980, fsc: 1020, net: 155 }
     * @returns {{ aggregate: number, tier: string, closingMerits: Object }}
     */
    calculate(universityId, scores) {
      const uni = UNIVERSITIES.find(u => u.id === universityId);
      if (!uni) throw new Error(`Unknown university: ${universityId}`);

      // Clamp every score to its valid range
      const clamped = {};
      for (const f of uni.fields) {
        clamped[f.key] = clamp(Number(scores[f.key]) || 0, 0, f.max);
      }

      const aggregate = parseFloat(uni.calc(clamped).toFixed(2));
      const closingMerits = HISTORICAL_MERITS[universityId] || {};

      // Determine tier against the most-recent closing merit (last index)
      let tier = 'low';
      const allRecent = Object.values(closingMerits).map(arr => arr[arr.length - 1]);
      if (allRecent.length) {
        const minMerit = Math.min(...allRecent);
        const avgMerit = allRecent.reduce((a, b) => a + b, 0) / allRecent.length;
        if (aggregate >= avgMerit + 2) tier = 'strong';
        else if (aggregate >= minMerit) tier = 'moderate';
      }

      return { aggregate, tier, closingMerits };
    }

    /* ── getChanceTier ───────────────────────── */
    /**
     * Compares a computed aggregate against a specific programme's
     * historical closing merits.
     * @returns {'strong'|'moderate'|'low'}
     */
    getChanceTier(aggregate, universityId, program) {
      const uniMerits = HISTORICAL_MERITS[universityId];
      if (!uniMerits || !uniMerits[program]) return 'low';

      const merits = uniMerits[program];
      const latest = merits[merits.length - 1];   // most-recent year
      const avg    = merits.reduce((a, b) => a + b, 0) / merits.length;

      if (aggregate >= latest + 2)  return 'strong';
      if (aggregate >= avg - 2)     return 'moderate';
      return 'low';
    }

    /* ════════════════════════════════════════════
       renderCalculator  — Full UI Renderer
       ════════════════════════════════════════════ */
    renderCalculator(containerId) {
      const root = document.getElementById(containerId);
      if (!root) { console.error(`Container #${containerId} not found`); return; }

      // --- Internal State ---
      let selectedUniId = UNIVERSITIES[0].id;
      let scores = {};

      // Inject scoped styles (only once)
      if (!document.getElementById('calc-styles')) {
        const style = document.createElement('style');
        style.id = 'calc-styles';
        style.textContent = buildCSS();
        document.head.appendChild(style);
      }

      const render = () => {
        const uni = UNIVERSITIES.find(u => u.id === selectedUniId);
        const saved = loadScores(selectedUniId);

        // Initialise scores from saved or zero
        scores = {};
        for (const f of uni.fields) {
          scores[f.key] = saved && saved[f.key] != null
            ? clamp(Number(saved[f.key]), 0, f.max)
            : 0;
        }

        const result = window.AggregateCalculator.prototype.calculate.call(
          this, selectedUniId, scores
        );

        root.innerHTML = buildHTML(uni, scores, result);
        attachListeners(root, uni);
      };

      /* ── Build static CSS ──────────────────── */
      function buildCSS() {
        return `
/* ====== Calculator Scoped Styles ====== */

/* University selector grid */
.calc-uni-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.calc-uni-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-md) var(--space-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
  user-select: none;
}

.calc-uni-card:hover {
  border-color: rgba(176, 38, 255, 0.35);
  background: var(--bg-elevated);
}

.calc-uni-card.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 16px var(--accent-glow);
  background: var(--bg-elevated);
}

.calc-uni-card .uni-emoji {
  font-size: 1.6rem;
  line-height: 1;
}

.calc-uni-card .uni-name {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Formula description */
.calc-formula {
  font-size: 0.82rem;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-lg);
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 0.02em;
}

/* Range / slider groups */
.calc-inputs-grid {
  display: grid;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.range-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.range-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.range-value {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--accent-primary);
  min-width: 64px;
  text-align: right;
}

.range-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.range-row input[type='range'] {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  transition: background var(--transition-fast);
}

.range-row input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  box-shadow: 0 0 8px var(--accent-glow);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.range-row input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 14px var(--accent-glow-strong);
}

.range-row input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  box-shadow: 0 0 8px var(--accent-glow);
}

.range-row input[type='number'] {
  width: 80px;
  padding: 6px 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  transition: border-color var(--transition-fast);
}

.range-row input[type='number']:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Hide native number spinners */
.range-row input[type='number']::-webkit-inner-spin-button,
.range-row input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.range-row input[type='number'] { -moz-appearance: textfield; }

.range-max {
  font-size: 0.72rem;
  color: var(--text-tertiary);
  text-align: right;
  margin-top: 2px;
}

/* Result card */
.calc-result {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  margin-bottom: var(--space-xl);
  animation: slideUp 0.4s ease both;
}

.calc-result.glow-strong {
  border-color: rgba(57, 255, 20, 0.3);
  box-shadow: 0 0 24px rgba(57, 255, 20, 0.08);
}
.calc-result.glow-moderate {
  border-color: rgba(255, 184, 0, 0.3);
  box-shadow: 0 0 24px rgba(255, 184, 0, 0.08);
}
.calc-result.glow-low {
  border-color: rgba(255, 49, 49, 0.3);
  box-shadow: 0 0 24px rgba(255, 49, 49, 0.08);
}

.calc-score {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.calc-score.tier-strong   { color: var(--status-success); text-shadow: 0 0 20px rgba(57,255,20,0.3); }
.calc-score.tier-moderate { color: var(--status-warning); text-shadow: 0 0 20px rgba(255,184,0,0.3); }
.calc-score.tier-low      { color: var(--status-danger);  text-shadow: 0 0 20px rgba(255,49,49,0.3); }

.calc-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-weight: 500;
}

.calc-tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-md);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 6px 18px;
  border-radius: var(--radius-full);
  font-family: var(--font-display);
}

/* Programme merit comparison section */
.calc-merits-section {
  margin-top: var(--space-lg);
}

.calc-merits-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.merit-program-row {
  margin-bottom: var(--space-md);
}

.merit-program-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.merit-program-name {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
}

.merit-program-value {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.merit-bar-container {
  position: relative;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: visible;
}

.merit-bar {
  position: relative;
  height: 100%;
  width: 100%;
}

.merit-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.merit-bar-fill.fill-merit {
  background: var(--border-color);
  opacity: 0.6;
}

.merit-bar-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--bg-surface);
  z-index: 2;
  transition: left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.merit-bar-marker.marker-you {
  background: var(--accent-primary);
  box-shadow: 0 0 8px var(--accent-glow);
}

.merit-bar-marker.marker-cutoff {
  background: var(--status-danger);
  box-shadow: 0 0 6px rgba(255,49,49,0.3);
  width: 3px;
  height: 16px;
  border-radius: 2px;
}

.merit-legend {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-sm);
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.merit-legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.merit-chance-badge {
  font-size: 0.72rem;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-family: var(--font-display);
}

/* ====== Responsive tweaks ====== */
@media (max-width: 600px) {
  .calc-uni-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .calc-score { font-size: 2.8rem; }
  .range-row input[type='number'] { width: 64px; }
}

/* Score count-up animation */
@keyframes countPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.calc-score.animate-pulse {
  animation: countPulse 0.4s ease;
}
`;
      }

      /* ── Build HTML string ─────────────────── */
      function buildHTML(uni, scores, result) {
        // University selector cards
        let uniCards = '';
        for (const u of UNIVERSITIES) {
          const sel = u.id === selectedUniId ? ' selected' : '';
          uniCards += `
            <div class="calc-uni-card${sel}" data-uni-id="${u.id}">
              <span class="uni-emoji">${u.logo}</span>
              <span class="uni-name">${u.shortName}</span>
            </div>`;
        }

        // Formula bar
        const formulaBar = `
          <div class="calc-formula">📐 ${uni.formulaDesc}</div>`;

        // Input sliders
        let inputFields = '';
        for (const f of uni.fields) {
          const val = scores[f.key] || 0;
          const pct = ((val / f.max) * 100).toFixed(1);
          inputFields += `
            <div class="range-group">
              <div class="range-header">
                <span class="range-label">${f.label}</span>
                <span class="range-value" id="rv-${f.key}">${val} <small style="color:var(--text-tertiary);font-weight:400">(${pct}%)</small></span>
              </div>
              <div class="range-row">
                <input type="range" min="0" max="${f.max}" step="${f.step}" value="${val}" data-field="${f.key}" data-max="${f.max}" />
                <input type="number" min="0" max="${f.max}" step="${f.step}" value="${val}" data-field="${f.key}" data-max="${f.max}" />
              </div>
              <div class="range-max">Max: ${f.max}</div>
            </div>`;
        }

        // Tier badge markup
        const tierClass = result.tier === 'strong'   ? 'badge-success'
                        : result.tier === 'moderate' ? 'badge-warning'
                        :                              'badge-danger';
        const tierLabel = result.tier === 'strong'   ? '🟢 Strong Chance'
                        : result.tier === 'moderate' ? '🟡 Moderate Chance'
                        :                              '🔴 Low Chance';

        const glowClass = `glow-${result.tier}`;

        // Merit comparison bars
        let meritBars = '';
        const merits = result.closingMerits;
        if (Object.keys(merits).length) {
          let rows = '';
          for (const [prog, arr] of Object.entries(merits)) {
            const latest  = arr[arr.length - 1];
            const chance  = window.AggregateCalculator.prototype.getChanceTier.call(
              null, result.aggregate, selectedUniId, prog
            );
            const chanceClass = chance === 'strong'   ? 'badge-success'
                              : chance === 'moderate' ? 'badge-warning'
                              :                         'badge-danger';
            const chanceText  = chance === 'strong'   ? 'Strong'
                              : chance === 'moderate' ? 'Moderate'
                              :                         'Low';

            // Bar positions (0-100 scale)
            const cutoffPos = Math.min(latest, 100);
            const youPos    = Math.min(result.aggregate, 100);

            // Calculate Required Target Score
            let reqText = '';
            const testField = uni.fields.find(f => !['matric', 'fsc', 'academic'].includes(f.key));
            if (testField && result.aggregate < latest) {
              const baseScores = { ...scores };
              baseScores[testField.key] = 0;
              const baseAggregate = uni.calc(baseScores);
              const neededAggregateFromTest = latest - baseAggregate;
              const testWeight = uni.weights[testField.key];
              
              if (neededAggregateFromTest > 0 && testWeight) {
                const requiredScore = (neededAggregateFromTest / (testWeight * 100)) * testField.max;
                if (requiredScore > testField.max) {
                  reqText = `<span class="badge badge-danger" style="margin-left: 8px;">Impossible (Needs ${Math.ceil(requiredScore)})</span>`;
                } else if (scores[testField.key] === 0 || scores[testField.key] < requiredScore) {
                  reqText = `<span class="badge badge-primary" style="margin-left: 8px;">Target ${testField.label}: ${Math.ceil(requiredScore)}</span>`;
                }
              }
            }

            rows += `
              <div class="merit-program-row">
                <div class="merit-program-header">
                  <span class="merit-program-name">${prog}</span>
                  <span class="merit-chance-badge ${chanceClass}">${chanceText}</span>
                </div>
                <div class="merit-bar-container">
                  <div class="merit-bar">
                    <div class="merit-bar-fill fill-merit" style="width:${cutoffPos}%"></div>
                    <div class="merit-bar-marker marker-cutoff" style="left:${cutoffPos}%" title="Closing merit: ${latest}%"></div>
                    <div class="merit-bar-marker marker-you" style="left:${youPos}%" title="Your aggregate: ${result.aggregate}%"></div>
                  </div>
                </div>
                <div class="merit-program-value" style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Closing merit (latest): ${latest}%</span>
                  ${reqText}
                </div>
              </div>`;
          }

          meritBars = `
            <div class="calc-merits-section">
              <h4 class="calc-merits-title">📊 Programme-wise Merit Comparison</h4>
              <div class="merit-legend">
                <span><span class="merit-legend-dot" style="background:var(--accent-primary)"></span> Your Aggregate</span>
                <span><span class="merit-legend-dot" style="background:var(--status-danger)"></span> Closing Merit</span>
              </div>
              ${rows}
            </div>`;
        }

        return `
          <div class="calc-uni-grid">${uniCards}</div>
          ${formulaBar}
          <div class="calc-inputs-grid">${inputFields}</div>
          <div class="calc-result ${glowClass}" id="calc-result-card">
            <div class="calc-label">Your Computed Aggregate</div>
            <div class="calc-score tier-${result.tier} animate-pulse" id="calc-score-display">${result.aggregate}%</div>
            <span class="calc-tier-badge ${tierClass}">${tierLabel}</span>
          </div>
          ${meritBars}
        `;
      }

      /* ── Attach event listeners ────────────── */
      function attachListeners(container, uni) {
        // University card selection
        container.querySelectorAll('.calc-uni-card').forEach(card => {
          card.addEventListener('click', () => {
            selectedUniId = card.dataset.uniId;
            render();
          });
        });

        // Slider + number input sync
        const rangeInputs  = container.querySelectorAll('input[type="range"]');
        const numberInputs = container.querySelectorAll('input[type="number"]');

        /** Recalculate & update result card without full re-render */
        const liveUpdate = () => {
          saveScores(selectedUniId, { ...scores });

          const result = window.AggregateCalculator.prototype.calculate.call(
            this, selectedUniId, scores
          );

          // Update score display
          const scoreEl = container.querySelector('#calc-score-display');
          if (scoreEl) {
            scoreEl.textContent = result.aggregate + '%';
            scoreEl.className = `calc-score tier-${result.tier} animate-pulse`;
            // Re-trigger animation
            scoreEl.style.animation = 'none';
            // eslint-disable-next-line no-unused-expressions
            scoreEl.offsetHeight;   // force reflow
            scoreEl.style.animation = '';
          }

          // Update tier badge
          const tierBadge = container.querySelector('.calc-tier-badge');
          if (tierBadge) {
            const tierClass = result.tier === 'strong'   ? 'badge-success'
                            : result.tier === 'moderate' ? 'badge-warning'
                            :                              'badge-danger';
            const tierLabel = result.tier === 'strong'   ? '🟢 Strong Chance'
                            : result.tier === 'moderate' ? '🟡 Moderate Chance'
                            :                              '🔴 Low Chance';
            tierBadge.className = `calc-tier-badge ${tierClass}`;
            tierBadge.textContent = tierLabel;
          }

          // Update result card glow
          const card = container.querySelector('#calc-result-card');
          if (card) {
            card.className = `calc-result glow-${result.tier}`;
          }

          // Update merit bars & per-programme chance badges
          const merits = result.closingMerits;
          container.querySelectorAll('.merit-program-row').forEach(row => {
            const progName = row.querySelector('.merit-program-name')?.textContent;
            if (!progName || !merits[progName]) return;

            const latest = merits[progName][merits[progName].length - 1];
            const youPos = Math.min(result.aggregate, 100);

            const youMarker = row.querySelector('.marker-you');
            if (youMarker) {
              youMarker.style.left = youPos + '%';
              youMarker.title = `Your aggregate: ${result.aggregate}%`;
            }

            const chance = window.AggregateCalculator.prototype.getChanceTier.call(
              null, result.aggregate, selectedUniId, progName
            );
            const cBadge = row.querySelector('.merit-chance-badge');
            if (cBadge) {
              const cClass = chance === 'strong'   ? 'badge-success'
                           : chance === 'moderate' ? 'badge-warning'
                           :                         'badge-danger';
              const cText  = chance === 'strong'   ? 'Strong'
                           : chance === 'moderate' ? 'Moderate'
                           :                         'Low';
              cBadge.className = `merit-chance-badge ${cClass}`;
              cBadge.textContent = cText;
            }
          });
        };

        /** Sync a field from a source input */
        const syncField = (fieldKey, value, max) => {
          const v = clamp(parseInt(value, 10) || 0, 0, max);
          scores[fieldKey] = v;

          // Sync sibling inputs (range ↔ number)
          container.querySelectorAll(`input[data-field="${fieldKey}"]`).forEach(el => {
            if (el.value !== String(v)) el.value = v;
          });

          // Update the range-value display
          const rv = container.querySelector(`#rv-${fieldKey}`);
          if (rv) {
            const pct = ((v / max) * 100).toFixed(1);
            rv.innerHTML = `${v} <small style="color:var(--text-tertiary);font-weight:400">(${pct}%)</small>`;
          }

          liveUpdate();
        };

        rangeInputs.forEach(inp => {
          inp.addEventListener('input', () => {
            syncField(inp.dataset.field, inp.value, Number(inp.dataset.max));
          });
        });

        numberInputs.forEach(inp => {
          inp.addEventListener('input', () => {
            syncField(inp.dataset.field, inp.value, Number(inp.dataset.max));
          });
          // Also handle blur for final clamping
          inp.addEventListener('blur', () => {
            const v = clamp(parseInt(inp.value, 10) || 0, 0, Number(inp.dataset.max));
            inp.value = v;
            syncField(inp.dataset.field, v, Number(inp.dataset.max));
          });
        });
      }

      // ── Initial render ──
      render();
    }
  }

  /* ── Expose globally ──────────────────────── */
  window.AggregateCalculator = AggregateCalculator;

})();
