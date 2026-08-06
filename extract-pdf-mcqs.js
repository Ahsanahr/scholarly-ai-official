/**
 * MCQ Data Ingestion & PDF/Text Extractor Pipeline
 * Usage:
 *   node extract-pdf-mcqs.js --subject=english --file=./english_500.txt (or .json / .pdf)
 *   node extract-pdf-mcqs.js --recount
 */

const fs = require('fs');
const path = require('path');

const MCQS_DIR = path.join(__dirname, 'public/data/mcqs');
const INDEX_FILE = path.join(MCQS_DIR, 'index.json');

// Ensure directory exists
if (!fs.existsSync(MCQS_DIR)) {
    fs.mkdirSync(MCQS_DIR, { recursive: true });
}

// Helper to parse CLI args
function getArgs() {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, val] = arg.slice(2).split('=');
            args[key] = val || true;
        }
    });
    return args;
}

// Recount totals across all 7 subjects
function updateIndexTotals() {
    if (!fs.existsSync(INDEX_FILE)) return;
    const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));

    indexData.forEach(sub => {
        const subFile = path.join(MCQS_DIR, `${sub.id}.json`);
        if (fs.existsSync(subFile)) {
            const mcqs = JSON.parse(fs.readFileSync(subFile, 'utf8'));
            sub.totalCount = mcqs.length;
        } else {
            sub.totalCount = 0;
        }
    });

    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));
    console.log('✅ Subject totals in index.json updated successfully!');
}

// Smart Text/PDF MCQ Parser
function parseMcqText(rawText, subjectId) {
    const questions = [];
    
    // Split text into question blocks by numbers (e.g. 1., Q1., 10., etc.)
    const qBlocks = rawText.split(/(?=(?:Q\d+[\.:\)]|\b\d{1,4}[\.:\)]))\s*/i).filter(b => b.trim().length > 10);

    qBlocks.forEach((block, idx) => {
        try {
            // Match question line
            const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length < 2) return;

            let questionText = lines[0].replace(/^(?:Q\d+[\.:\)]|\b\d{1,4}[\.:\)])\s*/i, '').trim();

            // Extract Options A, B, C, D
            let options = [];
            let fullBlockText = lines.join(' ');

            // Match options like A) option B) option or A. option B. option or (A) option (B) option
            const optRegex = /(?:[A-D][\.\)]|\([A-D]\))\s*([^A-D\(\)\n\r]+)/gi;
            let match;
            while ((match = optRegex.exec(fullBlockText)) !== null) {
                if (options.length < 4) {
                    options.push(match[1].trim());
                }
            }

            // Fallback options extraction line-by-line if regex missed
            if (options.length < 4) {
                const optLines = lines.filter(l => /^[A-D][\.\)]|\([A-D]\)/i.test(l));
                if (optLines.length >= 4) {
                    options = optLines.slice(0, 4).map(l => l.replace(/^[A-D][\.\)]|\([A-D]\)\s*/i, '').trim());
                }
            }

            if (options.length < 2) return;

            // Extract Answer
            let answerIndex = 0;
            const ansMatch = fullBlockText.match(/(?:Ans(?:wer)?|Correct)\s*[:=\-]?\s*([A-D0-3])/i);
            if (ansMatch) {
                const val = ansMatch[1].toUpperCase();
                if (val === 'A' || val === '0') answerIndex = 0;
                else if (val === 'B' || val === '1') answerIndex = 1;
                else if (val === 'C' || val === '2') answerIndex = 2;
                else if (val === 'D' || val === '3') answerIndex = 3;
            }

            // Extract Explanation
            let explanation = '';
            const expMatch = fullBlockText.match(/(?:Explanation|Rationale|Note)\s*[:=\-]?\s*(.+)/i);
            if (expMatch) {
                explanation = expMatch[1].trim();
            } else {
                explanation = `The correct choice is option ${String.fromCharCode(65 + answerIndex)}: ${options[answerIndex]}.`;
            }

            questions.push({
                id: `${subjectId.slice(0, 3)}_${Date.now().toString(36)}_${idx + 1}`,
                subjectId: subjectId,
                topic: "General Practice",
                difficulty: idx % 3 === 0 ? "Hard" : idx % 2 === 0 ? "Medium" : "Easy",
                question: questionText,
                options: options.length === 4 ? options : [...options, "None of the above"].slice(0, 4),
                answer: answerIndex,
                explanation: explanation
            });
        } catch (e) {
            // Ignore single malformed block
        }
    });

    return questions;
}

// Ingestion Main
function run() {
    const args = getArgs();

    if (args.recount) {
        updateIndexTotals();
        return;
    }

    const subject = args.subject;
    const filePath = args.file;

    if (!subject || !filePath) {
        console.log('Usage: node extract-pdf-mcqs.js --subject=[english|math|iq|physics|biology|chemistry|computer] --file=path/to/file.[txt|json]');
        updateIndexTotals();
        return;
    }

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    const targetJsonPath = path.join(MCQS_DIR, `${subject}.json`);
    let existingMcqs = fs.existsSync(targetJsonPath) ? JSON.parse(fs.readFileSync(targetJsonPath, 'utf8')) : [];

    const fileExt = path.extname(filePath).toLowerCase();
    let newMcqs = [];

    if (fileExt === '.json') {
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        newMcqs = Array.isArray(fileContent) ? fileContent : [fileContent];
    } else {
        const rawText = fs.readFileSync(filePath, 'utf8');
        newMcqs = parseMcqText(rawText, subject);
    }

    if (newMcqs.length === 0) {
        console.log('⚠️ No valid MCQs could be extracted from the file.');
        return;
    }

    // Append new MCQs
    const combined = [...existingMcqs, ...newMcqs];
    fs.writeFileSync(targetJsonPath, JSON.stringify(combined, null, 2));

    console.log(`🎉 Successfully added ${newMcqs.length} MCQs to subject '${subject}'! Total MCQs: ${combined.length}`);

    updateIndexTotals();
}

run();
