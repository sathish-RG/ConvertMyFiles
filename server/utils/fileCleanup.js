const fs = require('fs-extra');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

const cleanupOldFiles = async () => {
  try {
    if (!await fs.pathExists(uploadsDir)) {
      return;
    }

    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.remove(filePath);
        console.log(`Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    console.error('File cleanup error:', error);
  }
};

module.exports = { cleanupOldFiles };