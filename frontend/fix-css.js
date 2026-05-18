const fs = require('fs');
const filePath = 'c:/Users/deint/Desktop/FullStack-Donaton/frontend/src/index.css';
let content = fs.readFileSync(filePath, 'utf8');
const searchString = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`;
content = content.replace(searchString, '');
content = searchString + '\n' + content;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed CSS');
