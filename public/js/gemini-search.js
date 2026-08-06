/**
 * ============================================================
 *  ScholarPath AI — Gemini Search Engine
 * ============================================================
 *  Core search module that talks to Google Gemini 2.0 Flash
 *  and returns structured JSON about Pakistani universities,
 *  scholarships, entrance tests, and documents.
 *
 *  Exposed globally as `window.ScholarPathSearch`.
 * ============================================================
 */

;(function (window) {
  'use strict';

  /* -------------------------------------------------------
   *  Constants
   * ----------------------------------------------------- */

  const GEMINI_ENDPOINT = '/api/search/secure';

  const STORAGE_KEYS = {
    recentSearches : 'scholarpath_recent_searches',
    savedResults   : 'scholarpath_saved_results',
  };

  const MAX_RECENT_SEARCHES = 10;

  /* -------------------------------------------------------
   *  System prompt — tells Gemini *exactly* how to respond
   * ----------------------------------------------------- */

  const SYSTEM_PROMPT = `You are ScholarPath AI, a highly knowledgeable Pakistani academic search engine and counselor.

IMPORTANT RULES — follow every one:

1. You MUST respond ONLY with valid, raw JSON. No markdown, no code fences, no explanatory text outside JSON.
2. The JSON object you return MUST match this exact schema:

{
  "summary": "<A 2-3 sentence overview that directly answers the user's query>",
  "results": [
    {
      "id": "<unique lowercase kebab-case id>",
      "type": "university" | "scholarship" | "test" | "document" | "general",
      "title": "<Name of the result>",
      "description": "<2-3 sentence description with practical info>",
      "details": {
        // Include ONLY the keys relevant to the type:
        // university  → location, programs (array), website, ranking, fee_range, admission_deadline
        // scholarship → eligibility, amount, deadline, apply_link, provider
        // test        → date, registration_deadline, syllabus (array), exam_body, fee
        // document    → purpose, where_to_get, required_for (array), cost, processing_time
        // general     → any relevant key-value pairs
      },
      "tags": ["tag1", "tag2"]
    }
  ]
}

3. Focus exclusively on the Pakistani educational context — universities such as NUST, FAST-NUCES, GIKI, LUMS, COMSATS, UET, PIEAS, IBA, QAU, UoL, MUET, NED, ITU, Air University, Bahria, SZABIST, etc.
4. Provide practical, actionable information: real deadlines, approximate fee ranges (in PKR), official website URLs, eligibility criteria, and step-by-step guidance when appropriate.
5. If the query relates to merit, aggregate, or admission calculations, include the relevant formula (e.g., NUST NET-based aggregate formula, UET aggregate formula, NUMS formula, etc.).
6. Return between 3 and 8 results, ranked by relevance. Fewer is fine if the query is very specific.
7. Every "id" must be unique within the response.
8. Dates should be realistic for the current or next upcoming admission cycle.
9. If you are uncertain about a specific data point, say "Verify from official website" rather than inventing data.
10. Do NOT wrap the JSON in backticks or any other characters. The very first character of your response must be "{" and the very last must be "}".`;

  /* -------------------------------------------------------
   *  Utility helpers
   * ----------------------------------------------------- */

  /**
   * Read a JSON array from localStorage (returns [] on failure).
   */
  function _readStore(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Write a JSON-serialisable value to localStorage.
   */
  function _writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('[ScholarPath] localStorage write failed:', err);
    }
  }

  /**
   * Generate a simple unique-ish id.
   */
  function _uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Sanitise a string for safe HTML insertion.
   */
  function _esc(str) {
    const el = document.createElement('span');
    el.textContent = str ?? '';
    return el.innerHTML;
  }

  /* -------------------------------------------------------
   *  ScholarPathSearch class
   * ----------------------------------------------------- */

  class ScholarPathSearch {

    constructor() {
      /** Cache the last raw response for debugging */
      this._lastRaw = null;
    }

    /* =====================================================
     *  Core search
     * =================================================== */

    /**
     * Send an academic query to Gemini and return the parsed
     * JSON response.  Throws a user-friendly Error on failure.
     *
     * @param  {string} query — the user's search query
     * @return {Promise<{summary: string, results: Array}>}
     */
    async search(query) {
      if (window.ScholarAuth && !window.ScholarAuth.requireAuth('Search Engine')) {
        throw new Error('Authentication required to use the search engine.');
      }

      if (!query || !query.trim()) {
        throw new Error('Please enter a search query.');
      }

      const trimmed = query.trim();

      // Build the Gemini request body
      const body = {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: trimmed }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      };

      let res;
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          let headers = window.ScholarAuth ? await window.ScholarAuth.getAuthHeaders() : { 'Content-Type': 'application/json' };
          
          res = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
          });
        } catch (networkErr) {
          console.error('[ScholarPath] Network error:', networkErr);
          throw new Error(
            'Unable to reach the search service. Please check your internet connection and try again.'
          );
        }

        if (res.ok) {
            break; // Success!
        }
        
        const status = res.status;
        if (status === 429) {
            retries--;
            if (retries === 0) {
                throw new Error('Search rate limit reached — please wait a few seconds and try again.');
            }
            // Wait and retry
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        } else if (status === 403) {
            throw new Error('API access denied. The API key may be invalid or expired.');
        } else {
            let detail = '';
            try {
              const errJson = await res.json();
              detail = (typeof errJson.error === 'string') ? errJson.error : (errJson?.error?.message || '');
            } catch { /* ignore parse failure */ }
            throw new Error(`Search failed (HTTP ${status}). ${detail || 'Please try again later.'}`);
        }
      }

      // Parse the Gemini response envelope
      let geminiData;
      try {
        const textResponse = await res.text();
        try {
            geminiData = JSON.parse(textResponse);
        } catch (e) {
            console.error("Failed to parse JSON, received:", textResponse.substring(0, 100));
            throw new Error('Received an unreadable HTML response from the server. Please ensure the Next.js backend is running correctly.');
        }
      } catch (err) {
        throw new Error(err.message || 'Received an unreadable response from the search service.');
      }

      // Extract the text content from the first candidate
      const textContent =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        // Check for safety-block or empty response
        const blockReason = geminiData?.candidates?.[0]?.finishReason;
        if (blockReason === 'SAFETY') {
          throw new Error(
            'The query was blocked by content safety filters. Please rephrase and try again.'
          );
        }
        throw new Error('The search service returned an empty response. Please try a different query.');
      }

      this._lastRaw = textContent;

      // Parse the JSON the model returned
      let parsed;
      try {
        // Strip potential markdown fences the model may add despite instructions
        const cleaned = textContent
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/, '')
          .trim();
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error('[ScholarPath] JSON parse error:', parseErr, '\nRaw:', textContent);
        throw new Error(
          'The AI returned a malformed response. Please try your search again.'
        );
      }

      // Normalise: ensure every result has an id
      if (Array.isArray(parsed.results)) {
        parsed.results.forEach((r) => {
          if (!r.id) r.id = _uid();
        });

        // Restore Auto-Hydration Feature: Silently trigger backend to save to official database
        const primary = parsed.results[0];
        if (primary && primary.type && primary.title) {
          const apiCat = primary.type.toLowerCase();
          if (['university', 'scholarship', 'test', 'program'].includes(apiCat)) {
            if (window.ScholarAuth && window.ScholarAuth.getAuthHeaders) {
              window.ScholarAuth.getAuthHeaders().then(headers => {
                fetch('/api/search', {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify({
                    query: primary.title,
                    category: apiCat,
                    mode: 'structured',
                    scope: 'national'
                  })
                }).catch(e => console.warn('[ScholarPath] Background auto-hydration skipped:', e));
              });
            } else {
              fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  query: primary.title,
                  category: apiCat,
                  mode: 'structured',
                  scope: 'national'
                })
              }).catch(e => console.warn('[ScholarPath] Background auto-hydration skipped:', e));
            }
          }
        }
      }

      // Save to recent searches
      this.saveSearch(trimmed);

      return parsed;
    }

    /* =====================================================
     *  Recent searches (localStorage)
     * =================================================== */

    /**
     * Return the list of recent search objects (newest first).
     * @return {Array<{query: string, timestamp: number}>}
     */
    getRecentSearches() {
      const list = _readStore(STORAGE_KEYS.recentSearches);
      return list.map(item => {
        if (typeof item === 'string') {
          return { query: item, timestamp: Date.now() };
        }
        return item;
      });
    }

    /**
     * Add a query to the recent-searches list (deduped, capped).
     * @param {string} query
     */
    saveSearch(query) {
      if (!query) return;
      let list = this.getRecentSearches();
      // Remove duplicate if present
      list = list.filter((q) => q.query.toLowerCase() !== query.toLowerCase());
      // Prepend
      list.unshift({ query, timestamp: Date.now() });
      // Cap
      if (list.length > MAX_RECENT_SEARCHES) list = list.slice(0, MAX_RECENT_SEARCHES);
      _writeStore(STORAGE_KEYS.recentSearches, list);
    }

    /**
     * Clear all recent searches.
     */
    clearRecentSearches() {
      _writeStore(STORAGE_KEYS.recentSearches, []);
    }

    /* =====================================================
     *  Saved / bookmarked results (localStorage)
     * =================================================== */

    /**
     * Return all bookmarked results.
     * @return {Array<Object>}
     */
    getSavedResults() {
      return _readStore(STORAGE_KEYS.savedResults);
    }

    /**
     * Bookmark a result object.  Adds a `savedAt` timestamp.
     * @param {Object} result
     */
    saveResult(result) {
      if (!result) return;
      const list = this.getSavedResults();
      // Avoid duplicates by id
      if (list.some((r) => r.id === result.id)) return;
      list.unshift({ ...result, savedAt: new Date().toISOString() });
      _writeStore(STORAGE_KEYS.savedResults, list);
    }

    /**
     * Remove a bookmarked result by id.
     * @param {string} id
     */
    removeResult(id) {
      const list = this.getSavedResults().filter((r) => r.id !== id);
      _writeStore(STORAGE_KEYS.savedResults, list);
    }

    /**
     * Clear all saved results.
     */
    clearSavedResults() {
      _writeStore(STORAGE_KEYS.savedResults, []);
    }

    /* =====================================================
     *  HTML formatters
     * =================================================== */

    /**
     * Return an HTML string for the AI summary card.
     * @param  {string} summary
     * @return {string}
     */
    formatAISummaryAsHTML(summary) {
      if (!summary) return '';

      return `
        <div class="ai-response">
          <div class="ai-response-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#B026FF" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="ai-response-label">AI Summary</span>
          </div>
          <p class="ai-response-text">${_esc(summary)}</p>
        </div>`;
    }

    /**
     * Return an HTML string for all result cards.
     * @param  {{summary: string, results: Array}} response
     * @return {string}
     */
    formatResultsAsHTML(response) {
      if (!response) return '';

      let html = '';

      // AI summary
      if (response.summary) {
        html += this.formatAISummaryAsHTML(response.summary);
      }

      // Result cards
      if (Array.isArray(response.results) && response.results.length) {
        html += `<div class="results-list">`;

        response.results.forEach((r) => {
          html += this._renderResultCard(r);
        });

        html += `</div>`;
      } else {
        html += `
          <div class="no-results">
            <p>No specific results found. Try rephrasing your query.</p>
          </div>`;
      }

      return html;
    }

    /* =====================================================
     *  Internal: render a single result card
     * =================================================== */

    /**
     * @private
     * @param  {Object} r — a single result object
     * @return {string}   — HTML string
     */
    _renderResultCard(r) {
      const type        = r.type || 'general';
      const badgeClass  = `badge badge-${type}`;
      const typeLabel   = type.charAt(0).toUpperCase() + type.slice(1);

      // Build details rows
      let detailsHTML = '';
      if (r.details && typeof r.details === 'object') {
        detailsHTML = '<div class="result-card-details">';
        for (const [key, value] of Object.entries(r.details)) {
          const label = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          let displayValue;
          if (Array.isArray(value)) {
            displayValue = value.map((v) => _esc(String(v))).join(', ');
          } else if (
            typeof value === 'string' &&
            (value.startsWith('http://') || value.startsWith('https://'))
          ) {
            displayValue = `<a href="${_esc(value)}" target="_blank" rel="noopener noreferrer">${_esc(value)}</a>`;
          } else {
            displayValue = _esc(String(value ?? '—'));
          }

          detailsHTML += `
            <div class="detail-row">
              <span class="detail-label">${_esc(label)}</span>
              <span class="detail-value">${displayValue}</span>
            </div>`;
        }
        detailsHTML += '</div>';
      }

      // Tags
      let tagsHTML = '';
      if (Array.isArray(r.tags) && r.tags.length) {
        tagsHTML = '<div class="result-card-tags">';
        r.tags.forEach((t) => {
          tagsHTML += `<span class="tag">${_esc(t)}</span>`;
        });
        tagsHTML += '</div>';
      }

      // Bookmark icon (SVG)
      const bookmarkSVG = `
        <button class="btn-bookmark" data-result-id="${_esc(r.id)}" title="Save result"
                aria-label="Bookmark this result">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>`;

      return `
        <div class="result-card" data-result-id="${_esc(r.id)}" data-result-type="${_esc(type)}">
          <div class="result-card-header">
            <div class="result-card-header-left">
              <span class="${badgeClass}">${_esc(typeLabel)}</span>
              <h3 class="result-card-title">${_esc(r.title)}</h3>
            </div>
            ${bookmarkSVG}
          </div>
          <p class="result-card-description">${_esc(r.description)}</p>
          ${detailsHTML}
          ${tagsHTML}
        </div>`;
    }
  }

  /* -------------------------------------------------------
   *  Expose globally
   * ----------------------------------------------------- */

  window.ScholarPathSearch = ScholarPathSearch;

})(window);
