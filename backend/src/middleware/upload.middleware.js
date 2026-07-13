const { upload } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');
const securityConfig = require('../config/security.config');
const fs = require('fs');

const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    // Helper to delete file if it exists
    const cleanUpFile = () => {
      if (req.file) {
        const file = req.file;
        // Clean up local file
        if (file.path && !file.path.startsWith('http')) {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (e) {
            console.error(`Error deleting temp file ${file.path}:`, e.message);
          }
        }
        // Clean up Cloudinary file if it got uploaded
        else if (file.path && file.path.startsWith('http') && file.filename) {
          try {
            const { cloudinary } = require('../config/cloudinary');
            cloudinary.uploader.destroy(file.filename, { resource_type: 'raw' }).catch((e) => {
              console.error(`Error deleting Cloudinary file ${file.filename}:`, e.message);
            });
          } catch (e) {
            console.error('Error requiring cloudinary for cleanup:', e.message);
          }
        }
      }
    };

    if (err) {
      cleanUpFile();
      if (err.code === 'LIMIT_FILE_SIZE') {
        const sizeMb = Math.round(securityConfig.uploads.maxSize / (1024 * 1024));
        return next(ApiError.badRequest(`File size must be less than ${sizeMb} MB`));
      }
      return next(ApiError.badRequest(err.message));
    }

    if (!req.file) {
      return next(ApiError.badRequest('Please upload a PDF file'));
    }

    next();
  });
};

module.exports = handleUpload;