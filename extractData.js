const fs = require('fs');
const path = require('path');

function extractArray(filePath, arrayName, startPattern, endPattern, outPath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let startIndex = content.indexOf(startPattern);
        if (startIndex === -1) {
            console.log(`Could not find start pattern in ${filePath}`);
            return;
        }
        
        let sub = content.substring(startIndex + startPattern.length - 1);
        
        // Find matching closing bracket
        let bracketCount = 0;
        let endIndex = -1;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < sub.length; i++) {
            const char = sub[i];
            
            // Handle strings
            if ((char === '"' || char === "'" || char === '`') && sub[i-1] !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }
            
            if (!inString) {
                if (char === '[') bracketCount++;
                if (char === ']') {
                    bracketCount--;
                    if (bracketCount === 0) {
                        endIndex = i;
                        break;
                    }
                }
            }
        }
        
        if (endIndex === -1) {
            console.log(`Could not find end bracket in ${filePath}`);
            return;
        }
        
        let arrayStr = sub.substring(0, endIndex + 1);
        
        let data;
        try {
            data = eval(`(${arrayStr})`);
        } catch(e) {
            console.log(`Eval failed for ${filePath}: ${e.message}`);
            return;
        }
        
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
        console.log(`Successfully extracted ${outPath}`);
    } catch(err) {
        console.error(err);
    }
}

// Extract universities
extractArray(
    path.join(__dirname, 'public/js/universities.js'),
    'unis',
    'const unis = [',
    '];',
    path.join(__dirname, 'public/data/universities.json')
);

// Extract test prep
extractArray(
    path.join(__dirname, 'public/js/test-prep.js'),
    'entryTestsDatabase',
    'const entryTestsDatabase = [',
    '];',
    path.join(__dirname, 'public/data/test-prep.json')
);

// Extract consultants comprehensive
extractArray(
    path.join(__dirname, 'public/js/consultants.js'),
    'comprehensiveConsultants',
    'const comprehensiveConsultants = [',
    '];',
    path.join(__dirname, 'public/data/consultants-comp.json')
);

// Extract consultants oneTime
extractArray(
    path.join(__dirname, 'public/js/consultants.js'),
    'oneTimeConsultants',
    'const oneTimeConsultants = [',
    '];',
    path.join(__dirname, 'public/data/consultants-one.json')
);

const schPath = path.join(__dirname, 'public/js/scholarships/data.js');
if (fs.existsSync(schPath)) {
    let schContent = fs.readFileSync(schPath, 'utf8');
    let st = schContent.indexOf('window.ScholarshipsData = [');
    if (st !== -1) {
        extractArray(schPath, 'ScholarshipsData', 'window.ScholarshipsData = [', '];', path.join(__dirname, 'public/data/scholarships.json'));
    }
}
