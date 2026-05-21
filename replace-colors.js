const fs = require('fs');
const path = require('path');

const colorMappings = [
  { old: '#000000', new: '#F3EFE7' },
  { old: '#0F0F0F', new: '#DDD2C3' },
  { old: '#171717', new: '#FFFFFF' },
  { old: '#FFFFFF', new: '#1E1E1E' },
  { old: '#B8B8B8', new: '#6E5846' },
  { old: '#7A7A7A', new: '#8A8178' },
  { old: '#232323', new: '#CBB8A0' },
  { old: '#2779A7', new: '#121212' }
];

function findFiles(dir, ext = '.tsx') {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && item.name !== 'node_modules') {
        files.push(...findFiles(fullPath, ext));
      } else if (item.isFile() && item.name.endsWith(ext)) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // ignore
  }
  return files;
}

const files = findFiles('./src');
let totalReplacements = 0;

console.log('Found ' + files.length + ' .tsx files\n');

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let fileReplacements = 0;
    
    for (const { old, new: newColor } of colorMappings) {
      const escapedOld = old.replace(/#/g, '\\#');
      const regex = new RegExp(escapedOld, 'g');
      const matches = content.match(regex);
      if (matches && matches.length > 0) {
        fileReplacements += matches.length;
        content = content.replace(regex, newColor);
      }
    }
    
    if (fileReplacements > 0) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(path.basename(file) + ': ' + fileReplacements + ' replacements');
      totalReplacements += fileReplacements;
    }
  } catch (e) {
    console.error('Error processing ' + file + ': ' + e.message);
  }
}

console.log('\nTotal replacements: ' + totalReplacements);
