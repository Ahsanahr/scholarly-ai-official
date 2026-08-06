const fs = require('fs');
const path = require('path');

function replaceArray(filePath, startPattern, replacementText) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let startIndex = content.indexOf(startPattern);
        if (startIndex === -1) {
            console.log(`Could not find start pattern in ${filePath}`);
            return;
        }
        
        let sub = content.substring(startIndex + startPattern.length - 1);
        
        let bracketCount = 0;
        let endIndex = -1;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < sub.length; i++) {
            const char = sub[i];
            
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
                        endIndex = startIndex + startPattern.length - 1 + i;
                        break;
                    }
                }
            }
        }
        
        if (endIndex === -1) {
            console.log(`Could not find end bracket in ${filePath}`);
            return;
        }
        
        let newContent = content.substring(0, startIndex) + replacementText + content.substring(endIndex + 1);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Successfully refactored ${filePath}`);
    } catch(err) {
        console.error(err);
    }
}

replaceArray(
    path.join(__dirname, 'public/js/universities.js'),
    'const unis = [',
    'let unis = [];\n    // Load data dynamically\n    fetch("/data/universities.json").then(r => r.json()).then(data => { unis = data; if(document.getElementById("universitiesContainer")) window.UniversitiesModule.render("universitiesContainer"); }).catch(e => console.error("Error loading unis", e));'
);

replaceArray(
    path.join(__dirname, 'public/js/test-prep.js'),
    'const entryTestsDatabase = [',
    'let entryTestsDatabase = [];\n    fetch("/data/test-prep.json").then(r => r.json()).then(data => { entryTestsDatabase = data; if(document.getElementById("testPrepContainer")) window.TestPrepModule.render("testPrepContainer"); }).catch(e => console.error(e));'
);

replaceArray(
    path.join(__dirname, 'public/js/consultants.js'),
    'const comprehensiveConsultants = [',
    'let comprehensiveConsultants = [];\n    fetch("/data/consultants-comp.json").then(r => r.json()).then(data => { comprehensiveConsultants = data; if(document.getElementById("consultantsContainer")) window.ConsultantsModule.render("consultantsContainer"); }).catch(e => console.error(e));'
);

replaceArray(
    path.join(__dirname, 'public/js/consultants.js'),
    'const oneTimeConsultants = [',
    'let oneTimeConsultants = [];\n    fetch("/data/consultants-one.json").then(r => r.json()).then(data => { oneTimeConsultants = data; if(document.getElementById("consultantsContainer")) window.ConsultantsModule.render("consultantsContainer"); }).catch(e => console.error(e));'
);

const schPath = path.join(__dirname, 'public/js/scholarships/data.js');
if (fs.existsSync(schPath)) {
    replaceArray(
        schPath,
        'window.ScholarshipsData = [',
        'window.ScholarshipsData = [];\nfetch("/data/scholarships.json").then(r => r.json()).then(data => { window.ScholarshipsData = data; if(document.getElementById("scholarshipsContainer")) window.ScholarshipsModule.render("scholarshipsContainer"); }).catch(console.error);'
    );
}
