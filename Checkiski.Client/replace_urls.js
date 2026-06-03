const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('cloudinary_urls.json', 'utf8'));
urls['board-overhead.png'] = 'https://res.cloudinary.com/dddhzbrqy/image/upload/v1780506060/checkiski_frontend/board-overhead.jpg';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [filename, url] of Object.entries(urls)) {
      const target = `/images/${filename}`;
      if (content.includes(target)) {
        content = content.split(target).join(url);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
