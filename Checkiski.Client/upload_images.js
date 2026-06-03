const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dddhzbrqy',
  api_key: '269465313852975',
  api_secret: 'J9XF2lHIpe4IYwY6HjGt_5kedJ8'
});

const imagesDir = path.join(__dirname, 'public', 'images');

async function uploadImages() {
  const files = fs.readdirSync(imagesDir);
  const results = {};
  
  for (const file of files) {
    if (file.match(/\.(png|jpe?g|gif|webp)$/i)) {
      const filePath = path.join(imagesDir, file);
      console.log(`Uploading ${file}...`);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'checkiski_frontend',
          use_filename: true,
          unique_filename: false
        });
        results[file] = result.secure_url;
        console.log(`Uploaded ${file} -> ${result.secure_url}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }
  
  fs.writeFileSync('cloudinary_urls.json', JSON.stringify(results, null, 2));
  console.log('Done! URLs saved to cloudinary_urls.json');
}

uploadImages();
