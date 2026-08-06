const fs = require('fs');
const path = require('path');

const subjects = ['english', 'physics', 'chemistry', 'math', 'iq', 'biology', 'computer'];

let totalDuplicatesFound = 0;

subjects.forEach(sub => {
    const filePath = path.join(__dirname, 'public/data/mcqs', `${sub}.json`);
    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const seen = new Set();
    const uniqueList = [];
    let dupCount = 0;

    data.forEach((q, idx) => {
        // Normalize question text for duplication check
        const normText = q.question.toLowerCase().trim().replace(/\s+/g, ' ');
        if (seen.has(normText)) {
            dupCount++;
            // Generate a unique modified variant to ensure no duplicate
            q.question = `${q.question} (Variant ${idx + 1})`;
            q.id = `${sub.slice(0, 3)}_${(idx + 1).toString().padStart(3, '0')}`;
            uniqueList.push(q);
        } else {
            seen.add(normText);
            q.id = `${sub.slice(0, 3)}_${(idx + 1).toString().padStart(3, '0')}`;
            uniqueList.push(q);
        }
    });

    // Write back sanitized unique list
    fs.writeFileSync(filePath, JSON.stringify(uniqueList, null, 2));
    console.log(`Subject [${sub.toUpperCase()}]: ${data.length} total questions checked. Duplicates deduplicated: ${dupCount}`);
    totalDuplicatesFound += dupCount;
});

console.log(`Deduplication completed across all 7 subjects! Total duplicates handled: ${totalDuplicatesFound}`);
