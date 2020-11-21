const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid/v4');

const memoryUpload = multer();

const { UPLOAD_DIST } = process.env;

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    const { authUser } = req;
    let dir = `${UPLOAD_DIST}/0`;
    if (authUser) {
      dir = `${UPLOAD_DIST}/${authUser.id}`;
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const { originalname } = file;
    const fix = originalname.split('.');
    if (fix.length === 0) {
      // 没有后缀
      cb(null, uuid());
    } else {
      cb(null, `${uuid()}.${fix[fix.length - 1]}`);
    }
  },
});

const diskUpload = multer({ storage: diskStorage });

const upload = {
  memory: memoryUpload,
  disk: diskUpload,
};

module.exports = upload;
