/**
 * ============================================================
 *  ScholarPath AI — Academic Database & Manual Selection System
 * ============================================================
 *  Contains structured pre-defined datasets for Pakistani
 *  universities, cities, provinces, academic programs,
 *  scholarships, and boards.
 *
 *  Every category includes a compulsory "Other (Specify)" option.
 * ============================================================
 */

;(function (window) {
  'use strict';

  const ScholarPathDB = {
    provinces: [
      { id: 'punjab', name: 'Punjab' },
      { id: 'sindh', name: 'Sindh' },
      { id: 'kpk', name: 'Khyber Pakhtunkhwa (KPK)' },
      { id: 'balochistan', name: 'Balochistan' },
      { id: 'islamabad', name: 'Islamabad Capital Territory (ICT)' },
      { id: 'ajk', name: 'Azad Jammu & Kashmir (AJK)' },
      { id: 'gb', name: 'Gilgit-Baltistan (GB)' },
      { id: 'other', name: 'Other (Specify Custom Region)' }
    ],

    cities: [
      { id: 'lahore', name: 'Lahore' },
      { id: 'karachi', name: 'Karachi' },
      { id: 'islamabad', name: 'Islamabad' },
      { id: 'rawalpindi', name: 'Rawalpindi' },
      { id: 'peshawar', name: 'Peshawar' },
      { id: 'quetta', name: 'Quetta' },
      { id: 'multan', name: 'Multan' },
      { id: 'faisalabad', name: 'Faisalabad' },
      { id: 'gujranwala', name: 'Gujranwala' },
      { id: 'sialkot', name: 'Sialkot' },
      { id: 'hyderabad', name: 'Hyderabad' },
      { id: 'sukkur', name: 'Sukkur' },
      { id: 'bahawalpur', name: 'Bahawalpur' },
      { id: 'abbottabad', name: 'Abbottabad' },
      { id: 'sargodha', name: 'Sargodha' },
      { id: 'larkana', name: 'Larkana' },
      { id: 'mianwali', name: 'Mianwali' },
      { id: 'mirpur', name: 'Mirpur (AJK)' },
      { id: 'gilgit', name: 'Gilgit' },
      { id: 'other', name: 'Other (Specify Custom City)' }
    ],

    programs: [
      { id: 'cs_it', name: 'Computer Science & IT' },
      { id: 'se', name: 'Software Engineering' },
      { id: 'ai_ds', name: 'Artificial Intelligence & Data Science' },
      { id: 'pre_eng', name: 'Engineering (Electrical / Mech / Civil)' },
      { id: 'pre_med', name: 'Medical / MBBS / BDS / Pharmacy' },
      { id: 'bba_fin', name: 'Business Administration & Finance (BBA / BS AF)' },
      { id: 'media_comm', name: 'Media & Mass Communication' },
      { id: 'law', name: 'Law (LL.B)' },
      { id: 'arts_arch', name: 'Arts, Design & Architecture' },
      { id: 'basic_sci', name: 'Basic & Natural Sciences (Physics/Math/Chem)' },
      { id: 'social_sci', name: 'Social Sciences & Humanities' },
      { id: 'other', name: 'Other (Specify Custom Program)' }
    ],

    universities: [
      { id: 'nust', name: 'NUST — National University of Sciences & Tech' },
      { id: 'fast', name: 'FAST-NUCES' },
      { id: 'lums', name: 'LUMS — Lahore University of Management Sciences' },
      { id: 'comsats', name: 'COMSATS University Islamabad' },
      { id: 'uet_lhr', name: 'UET Lahore' },
      { id: 'pieas', name: 'PIEAS Islamabad' },
      { id: 'giki', name: 'GIKI — Ghulam Ishaq Khan Institute' },
      { id: 'qau', name: 'Quaid-i-Azam University (QAU) Islamabad' },
      { id: 'pu', name: 'Punjab University (PU) Lahore' },
      { id: 'aku', name: 'Aga Khan University (AKU)' },
      { id: 'iba', name: 'IBA Karachi' },
      { id: 'ned', name: 'NED University of Engineering & Tech Karachi' },
      { id: 'gcu', name: 'GCU — Government College University Lahore' },
      { id: 'uol', name: 'University of Lahore (UoL)' },
      { id: 'itu', name: 'ITU — Information Technology University Lahore' },
      { id: 'bahria', name: 'Bahria University' },
      { id: 'air_uni', name: 'Air University Islamabad' },
      { id: 'nums', name: 'NUMS — National University of Medical Sciences' },
      { id: 'szabist', name: 'SZABIST Karachi / Islamabad' },
      { id: 'uaf', name: 'UAF — University of Agriculture Faisalabad' },
      { id: 'mehran', name: 'Mehran UET (MUET) Jamshoro' },
      { id: 'uet_peshawar', name: 'UET Peshawar' },
      { id: 'uet_taxila', name: 'UET Taxila' },
      { id: 'duhs', name: 'Dow University of Health Sciences (DUHS)' },
      { id: 'kemu', name: 'King Edward Medical University (KEMU)' },
      { id: 'bzu', name: 'BZU — Bahauddin Zakariya University Multan' },
      { id: 'uok', name: 'University of Karachi (UoK)' },
      { id: 'ndu', name: 'NDU — National Defence University' },
      { id: 'arid', name: 'PMAS Arid Agriculture University' },
      { id: 'iiui', name: 'IIUI — International Islamic University Islamabad' },
      { id: 'other', name: 'Other (Specify Custom University)' }
    ],

    scholarships: [
      { id: 'hec_need', name: 'HEC Need-Based Scholarship Program' },
      { id: 'ehsaas', name: 'Ehsaas Undergraduate Scholarship' },
      { id: 'peef', name: 'PEEF — Punjab Educational Endowment Fund' },
      { id: 'seef', name: 'SEEF — Sindh Educational Endowment Fund' },
      { id: 'turkiye', name: 'Türkiye Bursları Scholarship' },
      { id: 'csc_china', name: 'CSC China Government Scholarship' },
      { id: 'fulbright', name: 'Fulbright Scholarship Program' },
      { id: 'scottish', name: 'Scottish Scholarship for Pakistani Women' },
      { id: 'merit_waiver', name: 'University Merit Fee Waivers' },
      { id: 'other', name: 'Other (Specify Custom Scholarship)' }
    ],

    boards: [
      { id: 'federal', name: 'FBISE — Federal Board Islamabad' },
      { id: 'lahore', name: 'BISE Lahore' },
      { id: 'rawalpindi', name: 'BISE Rawalpindi' },
      { id: 'faisalabad', name: 'BISE Faisalabad' },
      { id: 'multan', name: 'BISE Multan' },
      { id: 'gujranwala', name: 'BISE Gujranwala' },
      { id: 'karachi', name: 'BISE Karachi' },
      { id: 'hyderabad', name: 'BISE Hyderabad' },
      { id: 'peshawar', name: 'BISE Peshawar' },
      { id: 'cambridge', name: 'Cambridge International (CIE A-Levels)' },
      { id: 'aga_khan', name: 'Aga Khan Examination Board (AKU-EB)' },
      { id: 'other', name: 'Other (Specify Custom Board)' }
    ],

    categories: [
      { id: 'all', name: 'All Categories' },
      { id: 'university', name: 'Universities & Admissions' },
      { id: 'scholarship', name: 'Scholarships & Financial Aid' },
      { id: 'test', name: 'Entrance Tests & Merit' },
      { id: 'document', name: 'Documents & Verification' },
      { id: 'other', name: 'Other (Specify Custom Category)' }
    ],

    /**
     * Get array of items by category key
     */
    getItems(categoryKey) {
      if (categoryKey === 'universities' && window.UniversitiesModule && typeof window.UniversitiesModule.getAll === 'function') {
        const dynUnis = window.UniversitiesModule.getAll();
        if (dynUnis && dynUnis.length > 0) {
          // Map to match the { id, name } structure expected by dropdowns
          return dynUnis.map(u => ({ id: u.id, name: u.name }));
        }
      }
      if (categoryKey === 'scholarships' && window.ScholarshipsData) {
        if (window.ScholarshipsData.length > 0) {
          return window.ScholarshipsData.map(s => ({ id: s.id, name: s.title }));
        }
      }
      return this[categoryKey] || [];
    },

    /**
     * Populate a <select> element with predefined data from DB
     * Ensures "Other" is always present.
     */
    populateSelect(selectEl, categoryKey, placeholder = 'Select Option', selectedValue = '') {
      if (typeof selectEl === 'string') {
        selectEl = document.getElementById(selectEl);
      }
      if (!selectEl) return;

      const items = this.getItems(categoryKey);
      let html = `<option value="">${placeholder}</option>`;

      items.forEach(item => {
        const isSelected = selectedValue && (selectedValue === item.id || selectedValue === item.name);
        html += `<option value="${item.id}" ${isSelected ? 'selected' : ''}>${item.name}</option>`;
      });

      selectEl.innerHTML = html;
    },

    /**
     * Bind dynamic compulsory "Other" toggle behavior.
     * When select value === 'other', customInput container is shown.
     */
    attachOtherToggle(selectEl, customInputContainerEl, customInputEl) {
      if (typeof selectEl === 'string') selectEl = document.getElementById(selectEl);
      if (typeof customInputContainerEl === 'string') customInputContainerEl = document.getElementById(customInputContainerEl);
      if (typeof customInputEl === 'string') customInputEl = document.getElementById(customInputEl);

      if (!selectEl || !customInputContainerEl) return;

      const updateState = () => {
        const isOther = selectEl.value === 'other';
        customInputContainerEl.style.display = isOther ? 'block' : 'none';
        if (customInputEl) {
          customInputEl.required = isOther;
          if (isOther) {
            customInputEl.focus();
          }
        }
      };

      selectEl.addEventListener('change', updateState);
      // Run initial check
      updateState();
    },

    /**
     * Extract final effective value (returns custom text if "other" is selected)
     */
    getEffectiveValue(selectEl, customInputEl) {
      if (typeof selectEl === 'string') selectEl = document.getElementById(selectEl);
      if (typeof customInputEl === 'string') customInputEl = document.getElementById(customInputEl);

      if (!selectEl) return '';
      if (selectEl.value === 'other') {
        return customInputEl ? customInputEl.value.trim() : 'Other';
      }
      // Return selected option text or value
      const opt = selectEl.options[selectEl.selectedIndex];
      return opt ? opt.text : selectEl.value;
    }
  };

  window.ScholarPathDB = ScholarPathDB;
})(window);
