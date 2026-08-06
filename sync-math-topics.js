const fs = require('fs');
const path = require('path');

const mathData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/data/mcqs/math.json'), 'utf8'));

// Count exact totals per topic
const counts = {};
mathData.forEach(q => {
    const t = q.topic || "Basic & Advanced Algebra";
    counts[t] = (counts[t] || 0) + 1;
});

console.log("Math Topic Counts from math.json:", counts);

// Update index.json
const indexPath = path.join(__dirname, 'public/data/mcqs/index.json');
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const mathObj = indexData.find(s => s.id === 'math');
if (mathObj) {
    mathObj.totalCount = mathData.length;
    mathObj.topics = Object.keys(counts).map(tName => ({
        name: tName,
        total: counts[tName]
    }));
}

fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
console.log("Successfully updated index.json for Mathematics!");
