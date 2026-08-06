// utils/intentClassifier.ts — Search 02 Intent Detection
// ═══════════════════════════════════════════════════════
// Auto-detects search mode, category, and scope from a raw query string.
// Supports manual overrides for backward compatibility.

// ─── Keyword Dictionaries ────────────────────────────────────────

const QUESTION_WORDS = new Set([
  'who', 'what', 'where', 'when', 'why', 'how', 'which',
  'is', 'are', 'do', 'does', 'can', 'should', 'will', 'would',
  'compare', 'explain', 'tell', 'difference', 'best', 'top',
  'recommend', 'suggest', 'tips', 'guide', 'help', 'list',
  'overview', 'advantages', 'disadvantages', 'pros', 'cons',
  'better', 'worst', 'cheapest', 'easiest', 'hardest',
]);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  test: [
    'test', 'exam', 'entry test', 'entrance', 'mdcat', 'ecat',
    'net', 'nat', 'gat', 'hat', 'gre', 'sat', 'act', 'ielts',
    'toefl', 'nust entry', 'fast entry', 'giki entry', 'nums',
    'lcat', 'mcat', 'aptitude', 'merit formula', 'aggregate',
    'syllabus', 'passing marks', 'cut off', 'cutoff',
    'registration deadline', 'test date', 'preparation',
  ],
  university: [
    'university', 'uni', 'campus', 'admission', 'faculty',
    'department', 'institute', 'college', 'nust', 'fast',
    'lums', 'comsats', 'uet', 'pieas', 'giki', 'qau', 'iba',
    'ned', 'gcu', 'itu', 'bahria', 'nums', 'szabist', 'uaf',
    'bzu', 'iiui', 'air university', 'mehran', 'duhs', 'kemu',
    'aku', 'pucit', 'ndu', 'arid', 'uol', 'uok', 'numl',
    'awkum', 'harvard', 'mit', 'oxford', 'cambridge', 'stanford',
    'fee structure', 'hostel', 'ranking', 'programs offered',
  ],
  scholarship: [
    'scholarship', 'funding', 'financial aid', 'stipend', 'grant',
    'bursary', 'ehsaas', 'peef', 'seef', 'fulbright', 'chevening',
    'daad', 'csc', 'commonwealth', 'erasmus', 'turkiye burslari',
    'scottish', 'merit waiver', 'hec need', 'fee waiver',
    'funded', 'fully funded', 'partial scholarship',
  ],
  program: [
    'degree', 'program', 'programme', 'bs', 'ms', 'mba', 'phd',
    'engineering', 'medical', 'mbbs', 'bds', 'pharmacy', 'law',
    'llb', 'computer science', 'software', 'artificial intelligence',
    'data science', 'bba', 'msc', 'bsc', 'curriculum', 'course',
    'career prospects', 'scope of', 'scope in',
  ],
};

const NATIONAL_KEYWORDS = new Set([
  'pakistan', 'pakistani', 'punjab', 'sindh', 'kpk', 'balochistan',
  'lahore', 'karachi', 'islamabad', 'rawalpindi', 'peshawar',
  'quetta', 'multan', 'faisalabad', 'hyderabad', 'abbottabad',
  'hec', 'pkr', 'rupees', 'fsc', 'matric', 'inter', 'intermediate',
  'board', 'bise', 'fbise', 'pmdc', 'pmc',
  'nust', 'fast', 'lums', 'comsats', 'uet', 'giki', 'pieas', 'iba',
  'mdcat', 'ecat', 'net', 'ehsaas', 'peef',
  'nums', 'ned', 'gcu', 'itu', 'bahria', 'szabist', 'uaf', 'bzu',
  'iiui', 'duhs', 'kemu', 'aku', 'pucit', 'numl', 'awkum',
]);

const INTERNATIONAL_KEYWORDS = new Set([
  'usa', 'uk', 'canada', 'australia', 'germany', 'china', 'turkey',
  'abroad', 'overseas', 'foreign', 'international',
  'fulbright', 'chevening', 'daad', 'csc', 'commonwealth', 'erasmus',
  'gre', 'sat', 'act', 'ielts', 'toefl',
  'ivy league', 'harvard', 'mit', 'oxford', 'cambridge', 'stanford',
  'europe', 'asia', 'america', 'british', 'american', 'canadian',
  'australian', 'german', 'chinese', 'turkish',
]);

// ─── Classification Function ────────────────────────────────────

export interface IntentResult {
  mode: 'structured' | 'unstructured';
  category: 'university' | 'scholarship' | 'test' | 'program' | 'general';
  scope: 'national' | 'international';
}

export function classifyIntent(
  query: string,
  overrides?: { mode?: string; category?: string; scope?: string }
): IntentResult {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  // ── Mode Detection ──────────────────────────────────────────

  let mode: 'structured' | 'unstructured' = 'structured';

  // Check if query is a question
  const isQuestion = q.endsWith('?');
  const startsWithQuestionWord = words.length > 0 && QUESTION_WORDS.has(words[0]);
  const containsQuestionPattern = words.some(w => QUESTION_WORDS.has(w));

  // If it looks like a natural language question, treat as unstructured
  if (isQuestion || startsWithQuestionWord) {
    mode = 'unstructured';
  } else if (words.length > 5 && containsQuestionPattern) {
    // Longer queries with question words are likely conversational
    mode = 'unstructured';
  }

  // ── Category Detection ──────────────────────────────────────

  // Score each category by counting keyword matches
  const categoryScores: Record<string, number> = {
    test: 0,
    university: 0,
    scholarship: 0,
    program: 0,
  };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        // Multi-word keywords get higher weight
        categoryScores[cat] += kw.includes(' ') ? 3 : 1;
      }
    }
  }

  // Priority order: test > university > scholarship > program
  const priorityOrder = ['test', 'university', 'scholarship', 'program'] as const;
  let category: IntentResult['category'] = 'general';

  let maxScore = 0;
  for (const cat of priorityOrder) {
    if (categoryScores[cat] > maxScore) {
      maxScore = categoryScores[cat];
      category = cat;
    }
  }

  // ── Scope Detection ─────────────────────────────────────────

  let scope: 'national' | 'international' = 'national'; // Default

  let nationalScore = 0;
  let internationalScore = 0;

  for (const word of words) {
    if (NATIONAL_KEYWORDS.has(word)) nationalScore++;
    if (INTERNATIONAL_KEYWORDS.has(word)) internationalScore++;
  }

  // Also check multi-word phrases
  for (const kw of Array.from(INTERNATIONAL_KEYWORDS)) {
    if (kw.includes(' ') && q.includes(kw)) internationalScore += 2;
  }

  if (internationalScore > nationalScore) {
    scope = 'international';
  }

  // ── Apply Overrides ─────────────────────────────────────────

  if (overrides) {
    if (overrides.mode === 'simple') mode = 'unstructured';
    if (overrides.mode === 'program') mode = 'structured';

    if (overrides.category && overrides.category !== '' && overrides.category !== 'auto') {
      const catMap: Record<string, IntentResult['category']> = {
        university: 'university',
        scholarship: 'scholarship',
        test: 'test',
        program: 'program',
        // Support old uppercase values from frontend
        University: 'university',
        Scholarship: 'scholarship',
        Test: 'test',
        Program: 'program',
      };
      category = catMap[overrides.category] || category;
    }

    if (overrides.scope === 'national') scope = 'national';
    if (overrides.scope === 'international') scope = 'international';
  }

  return { mode, category, scope };
}
