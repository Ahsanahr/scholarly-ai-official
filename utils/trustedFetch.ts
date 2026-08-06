// utils/trustedFetch.ts — Cascading Multi-Site Scraper for Search 02

const LOCAL_DOMAINS = [
  "eduvision.edu.pk",
  "ilmkidunya.com",
  "hec.gov.pk",
  "scholarbee.pk",
];

const GLOBAL_DOMAINS = [
  "topuniversities.com",
  "studyportals.com",
  "scholars4dev.com",
  "fastweb.com",
];

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Aggressively strip HTML boilerplate, keeping only meaningful content text.
 * Removes nav, footer, header, aside, scripts, styles, ads, cookie banners.
 */
function stripHtmlBoilerplate(html: string): string {
  return html
    // Remove script and style blocks entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove nav, footer, header, aside blocks
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '')
    // Remove common ad/cookie containers by class/id patterns
    .replace(/<div[^>]*(?:class|id)=["'][^"']*(?:cookie|consent|banner|advertisement|ad-|popup|modal|overlay)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if merged scraped content has adequate coverage for the query.
 * Requires >= 300 words AND >= 60% of significant query terms present.
 */
function hasAdequateCoverage(mergedText: string, query: string): boolean {
  const words = mergedText.split(/\s+/);
  if (words.length < 300) return false;
  
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (queryTerms.length === 0) return words.length >= 300;
  
  const lowerText = mergedText.toLowerCase();
  const matchCount = queryTerms.filter(term => lowerText.includes(term)).length;
  const coverage = matchCount / queryTerms.length;
  
  return coverage >= 0.6;
}

/**
 * Attempt to scrape a single domain via DuckDuckGo site search.
 * Returns cleaned text content or null on failure.
 */
async function scrapeDomain(domain: string, query: string): Promise<{ text: string; domain: string } | null> {
  // Try DuckDuckGo site search first
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:${domain} ${query}`)}`;
    const response = await fetch(searchUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (response.ok) {
      const html = await response.text();
      const cleanText = stripHtmlBoilerplate(html);
      
      const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
      const hasMatch = queryTerms.some(term => cleanText.toLowerCase().includes(term));

      if (cleanText.length > 150 && hasMatch) {
        return { text: cleanText.slice(0, 5000), domain };
      }
    }
  } catch (e) {
    console.warn(`DDG search failed for ${domain}:`, e);
  }

  // Fallback: fetch domain homepage directly
  try {
    const fbResponse = await fetch(`https://${domain}`, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (fbResponse.ok) {
      const text = await fbResponse.text();
      const cleanFb = stripHtmlBoilerplate(text);
      if (cleanFb.length > 500) {
        return { text: cleanFb.slice(0, 5000), domain };
      }
    }
  } catch (fbErr) {
    console.warn(`Direct fallback failed for ${domain}`);
  }

  return null;
}

// ──────────────────────────────────────────────────────────────
// NEW: Cascading multi-site scraper for Search 02
// ──────────────────────────────────────────────────────────────

export interface CascadeResult {
  texts: string[];
  domains: string[];
  mergedText: string;
}

/**
 * Cascading scraper: queries trusted domains in batches of 2.
 * After each batch, checks if coverage is adequate.
 * Stops early when sufficient content is gathered.
 * Returns merged content from all successful scrapes.
 */
export async function fetchCascadingContent(
  query: string,
  isNational: boolean
): Promise<CascadeResult | null> {
  const targetDomains = isNational ? LOCAL_DOMAINS : GLOBAL_DOMAINS;
  const collectedTexts: string[] = [];
  const collectedDomains: string[] = [];

  // Process domains in batches of 2
  for (let i = 0; i < targetDomains.length; i += 2) {
    const batch = targetDomains.slice(i, i + 2);
    
    // Scrape batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(domain => scrapeDomain(domain, query))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        collectedTexts.push(result.value.text);
        collectedDomains.push(result.value.domain);
      }
    }

    // Check coverage after this batch
    if (collectedTexts.length > 0) {
      const mergedText = collectedTexts.join('\n\n---\n\n');
      if (hasAdequateCoverage(mergedText, query)) {
        console.log(`[Cascade] Adequate coverage after ${i + batch.length} domains (${collectedDomains.join(', ')})`);
        return { texts: collectedTexts, domains: collectedDomains, mergedText };
      }
    }
  }

  // Return whatever we collected, even if coverage isn't ideal
  if (collectedTexts.length > 0) {
    const mergedText = collectedTexts.join('\n\n---\n\n');
    console.log(`[Cascade] Returning partial coverage from ${collectedDomains.join(', ')}`);
    return { texts: collectedTexts, domains: collectedDomains, mergedText };
  }

  // If absolutely no content was found on trusted domains, fall back to general web search
  console.log(`[Cascade] No content found on trusted domains, falling back to general web search...`);
  const generalResult = await searchGeneralWeb(query);
  if (generalResult) {
    return generalResult;
  }

  return null;
}

/**
 * Filter out tracking/engine links and return clean external URLs from search results.
 */
function extractLinks(html: string): string[] {
  const links: string[] = [];
  const regex = /href=["'](https?:\/\/[^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (
      url.includes('duckduckgo.com') ||
      url.includes('ddg.gg') ||
      url.includes('yandex.com') ||
      url.includes('google.com') ||
      url.includes('yahoo.com') ||
      url.includes('bing.com') ||
      url.includes('microsoft.com') ||
      url.includes('w3.org') ||
      url.includes('wikipedia.org/wiki/Special:') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.css') ||
      url.endsWith('.js')
    ) {
      continue;
    }
    if (!links.includes(url)) {
      links.push(url);
    }
  }
  return links.slice(0, 3);
}

/**
 * Perform a general web search fallback:
 * 1. Query DuckDuckGo without site restrictions.
 * 2. Extract top search result links.
 * 3. Scrape pages in parallel.
 */
async function searchGeneralWeb(query: string): Promise<CascadeResult | null> {
  try {
    console.log(`[GeneralSearch] Fetching DDG search results for: "${query}"`);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      console.warn(`[GeneralSearch] DDG fetch failed: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const links = extractLinks(html);
    console.log(`[GeneralSearch] Extracted links:`, links);

    if (links.length === 0) return null;

    const collectedTexts: string[] = [];
    const collectedDomains: string[] = [];

    const scrapePromises = links.map(async (url) => {
      try {
        const domain = new URL(url).hostname;
        const res = await fetch(url, {
          headers: { "User-Agent": USER_AGENT },
        });
        if (res.ok) {
          const pageHtml = await res.text();
          const cleanText = stripHtmlBoilerplate(pageHtml);
          if (cleanText.length > 200) {
            return { text: cleanText.slice(0, 6000), domain };
          }
        }
      } catch (err: any) {
        console.warn(`[GeneralSearch] Failed to scrape link ${url}:`, err.message);
      }
      return null;
    });

    const results = await Promise.allSettled(scrapePromises);
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        collectedTexts.push(result.value.text);
        collectedDomains.push(result.value.domain);
      }
    }

    if (collectedTexts.length > 0) {
      const mergedText = collectedTexts.join('\n\n---\n\n');
      return {
        texts: collectedTexts,
        domains: collectedDomains,
        mergedText
      };
    }
  } catch (err: any) {
    console.error(`[GeneralSearch] Error during general web search:`, err.message);
  }
  return null;
}

// ──────────────────────────────────────────────────────────────
// LEGACY: Sequential single-result scraper (kept for backward compatibility)
// ──────────────────────────────────────────────────────────────

/**
 * @deprecated Use fetchCascadingContent instead.
 * Sequentially searches 4 domains and stops after the first successful match.
 */
export async function fetchTrustedContentSequential(
  query: string,
  isNational: boolean
): Promise<{ text: string; domain: string } | null> {
  const targetDomains = isNational ? LOCAL_DOMAINS : GLOBAL_DOMAINS;

  for (const domain of targetDomains) {
    const result = await scrapeDomain(domain, query);
    if (result) return result;
  }

  return null;
}
