const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (/\.(tsx?|jsx?|md)$/.test(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('—')) {
        content = content.replace(/—/g, ',');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'frontend/src'));
replaceInDir(path.join(__dirname, 'backend/src'));
console.log('Done.');
