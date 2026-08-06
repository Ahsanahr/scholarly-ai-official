const fs = require('fs');
const file = 'public/dashboard.html';
let content = fs.readFileSync(file, 'utf8');

const searchStr = "onclick=\"alert('Current Credits: 25\\n\\nUpgrade your plan to get more credits!')\"";
const replaceStr = "onclick=\"switchView('pricing')\"";

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    content = content.replace("25 Credits", "15 Credits"); // Fix the text inside
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed creditToggle onclick');
} else {
    console.log('Target string not found');
}
