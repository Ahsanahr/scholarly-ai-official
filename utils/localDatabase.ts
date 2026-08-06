import fs from 'fs';
import path from 'path';

function getDataFilePath(type: 'university' | 'scholarship' | 'test' | 'program'): string {
  if (type === 'scholarship') {
    return path.join(process.cwd(), 'public', 'data', 'scholarships.json');
  }
  if (type === 'program') {
    return path.join(process.cwd(), 'public', 'data', 'programs.json');
  }
  if (type === 'university') {
    return path.join(process.cwd(), 'public', 'data', 'universities.json');
  }
  if (type === 'test') {
    return path.join(process.cwd(), 'public', 'data', 'test-prep.json');
  }
  return '';
}

export function getLocalDataset(type: 'university' | 'scholarship' | 'test' | 'program') {
  try {
    const filePath = getDataFilePath(type);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // All datasets are now standard JSON arrays
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error reading local dataset for ${type}:`, err);
    return [];
  }
}

export function findInDataset(dataset: any[], query: string): any | undefined {
  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/).filter((w: string) => w.length > 1);
  
  let bestMatch: any = undefined;
  let bestScore = 0;
  
  for (let i = dataset.length - 1; i >= 0; i--) {
    const item = dataset[i];
    const name = (item.name || item.title || item.test_name || item.program_name || '').toLowerCase().trim();
    if (!name) continue;
    
    let score = 0;
    
    if (name === lowerQuery) {
      score = 100;
    } else if (name.includes(lowerQuery)) {
      score = 80;
    } else if (lowerQuery.includes(name)) {
      score = 60;
    } else {
      const nameWords = name.split(/\s+/).filter((w: string) => w.length > 1);
      const matchCount = queryWords.filter((qw: string) => nameWords.some((nw: string) => nw.includes(qw) || qw.includes(nw))).length;
      const overlapRatio = queryWords.length > 0 ? matchCount / queryWords.length : 0;
      if (overlapRatio >= 0.5) {
        score = Math.round(40 * overlapRatio);
      }
    }
    
    if (item.id && item.id.toLowerCase() === lowerQuery) {
      score = Math.max(score, 90);
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
    
    if (score === 100) break;
  }
  
  return bestScore >= 40 ? bestMatch : undefined;
}

export function isEnrichedRecord(item: any, type: 'university' | 'scholarship' | 'test' | 'program'): boolean {
  if (!item) return false;
  if (type === 'university') return !!(item.programs || item.introduction);
  if (type === 'scholarship') return !!(item.description || item.introduction || item.eligibilityCriteria);
  if (type === 'test') return !!(item.introduction || item.syllabus_weightage || item.passing_criteria);
  if (type === 'program') return !!(item.program_name && item.introduction && item.offering_universities);
  return false;
}

export function appendToLocalDataset(type: 'university' | 'scholarship' | 'test' | 'program', newItem: any) {
  try {
    const filePath = getDataFilePath(type);
    
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, '[]', 'utf-8');
      } catch (err) {
        console.warn(`[localDatabase] Read-only filesystem on Vercel, cannot create ${filePath}`);
        return false;
      }
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    let dataset = [];
    try {
      dataset = JSON.parse(fileContent);
    } catch (e) {
      console.warn(`[localDatabase] Failed to parse ${filePath}, initializing as empty array`);
      dataset = [];
    }
    
    if (!Array.isArray(dataset)) dataset = [];
    
    const existingIndex = dataset.findIndex((item: any) => item.id === newItem.id);
    if (existingIndex !== -1) {
      dataset[existingIndex] = newItem;
    } else {
      dataset.push(newItem);
    }
    
    const newJsonStr = JSON.stringify(dataset, null, 4);
    try {
      fs.writeFileSync(filePath, newJsonStr, 'utf-8');
    } catch (err) {
      console.warn(`[localDatabase] Read-only filesystem on Vercel, skipping file write for ${type}`);
    }
    return true;
  } catch (err) {
    console.error(`Error handling local dataset for ${type}:`, err);
    return false;
  }
}
