import multer from 'multer';
import fileService from '#src/services/file.service.js';
import { ValidationError } from '#src/utils/error.class.js';

await fileService.ensureDirectoriesExist();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAvatar = req.route.path.includes('avatar');
    const dir = isAvatar ? fileService.avatarDir : fileService.postsDir;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const prefix = req.route.path.includes('avatar') ? 'avatar-' : 'post-';
    const filename = fileService.generateFilename(file.originalname, prefix);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (!fileService.validateFileType(file.mimetype)) {
    return cb(new ValidationError('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }

  cb(null, true);
};

const createUploader = (options = {}) => {
  const maxFileSize = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 5 * 1024 * 1024;

  return multer({
    storage,
    limits: {
      fileSize: options.maxSize || maxFileSize,
      files: options.maxFiles || 1
    },
    fileFilter
  });
};

const createUploadMiddleware = (uploader) => {
  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ValidationError('File too large. Maximum size is 5MB'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new ValidationError('Too many files'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ValidationError('Unexpected field'));
        }
        return next(err);
      }
      next();
    });
  };
};

export const uploadAvatar = createUploadMiddleware(
  createUploader().single('avatar')
);

export const uploadPostImage = createUploadMiddleware(
  createUploader().single('image')
);

export const uploadPostImages = createUploadMiddleware(
  createUploader({ maxFiles: 5 }).array('images', 5)
);