const path = require('path');
const securityConfig = require('../config/security.config');

/**
 * Wraps any Multer storage engine (Cloudinary, Disk, or Memory) to enforce
 * magic-byte stream validation before writing or uploading the file.
 * This prevents files with bad extensions or invalid headers from being processed.
 */
const makeSecureStorage = (baseStorage) => {
  return {
    _handleFile: (req, file, cb) => {
      // 1. MIME type validation
      if (!securityConfig.uploads.allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Only PDF files are allowed'));
      }

      // 2. Extension validation
      const fileExt = path.extname(file.originalname || '').toLowerCase();
      if (fileExt !== '.pdf' || securityConfig.uploads.blockedExtensions.includes(fileExt)) {
        return cb(new Error('Only PDF files are allowed'));
      }

      // 3. Magic-byte stream validation
      let header = Buffer.alloc(0);

      const onReadable = () => {
        let chunk;
        while ((chunk = file.stream.read(5 - header.length)) !== null) {
          header = Buffer.concat([header, chunk]);
          if (header.length >= 5) {
            break;
          }
        }

        if (header.length >= 5) {
          cleanup();
          // Put the read chunk back at the beginning of the stream
          file.stream.unshift(header);

          // Verify signature is exactly '%PDF-'
          if (header.toString('utf-8') === '%PDF-') {
            baseStorage._handleFile(req, file, cb);
          } else {
            cb(new Error('Only PDF files are allowed'));
          }
        }
      };

      const onError = (err) => {
        cleanup();
        cb(err);
      };

      const onEnd = () => {
        cleanup();
        if (header.length < 5) {
          cb(new Error('Only PDF files are allowed'));
        }
      };

      const cleanup = () => {
        file.stream.removeListener('readable', onReadable);
        file.stream.removeListener('error', onError);
        file.stream.removeListener('end', onEnd);
      };

      file.stream.on('readable', onReadable);
      file.stream.on('error', onError);
      file.stream.on('end', onEnd);

      // Trigger initial read check
      onReadable();
    },

    _removeFile: (req, file, cb) => {
      baseStorage._removeFile(req, file, cb);
    }
  };
};

module.exports = makeSecureStorage;
