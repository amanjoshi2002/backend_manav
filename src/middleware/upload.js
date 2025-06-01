const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../utils/s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      let folder = 'uploads';
      if (file.fieldname === 'video') folder = 'videos';
      if (file.fieldname === 'pdf') folder = 'pdfs';
      if (file.fieldname === 'image') folder = 'images';
      cb(null, `${folder}/${Date.now().toString()}_${file.originalname}`);
    }
  })
});

module.exports = upload;