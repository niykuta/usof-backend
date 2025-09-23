import fs from 'fs/promises';
import path from 'path';

class FileService {
  constructor() {
    this.uploadsDir = 'uploads';
    this.avatarDir = path.join(this.uploadsDir, 'avatars');
    this.postsDir = path.join(this.uploadsDir, 'posts');
  }

  async ensureDirectoriesExist() {
    const dirs = [this.uploadsDir, this.avatarDir, this.postsDir];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  validateFileType(mimetype) {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    return allowedTypes.includes(mimetype);
  }


  generateFilename(originalname, prefix = '') {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const extension = path.extname(originalname);

    return `${prefix}${timestamp}-${random}${extension}`;
  }

  getFilePath(filename, type = 'avatar') {
    const baseDir = type === 'avatar' ? this.avatarDir : this.postsDir;
    return path.join(baseDir, filename);
  }

  getFileUrl(filename, type = 'avatar') {
    const subdir = type === 'avatar' ? 'avatars' : 'posts';
    return `/uploads/${subdir}/${filename}`;
  }

  async deleteFile(filename, type = 'avatar') {
    if (!filename) return;

    try {
      const filePath = this.getFilePath(filename, type);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file ${filename}:`, error.message);
    }
  }

  extractFilenameFromUrl(url) {
    if (!url) return null;
    return path.basename(url);
  }
}

export default new FileService();