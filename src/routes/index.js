import express from 'express';
import ERROR from '@const/ERROR.json';
import jsonResponse from '@middlewares/jsonResponse';
import upload from '@middlewares/upload';
import userParser from '@middlewares/userParser';

const router = express.Router();

const { UPLOAD_STATIC_PATH } = process.env;

/* GET home page. */
router.get('/t.json', (req, res, next) => {
  res.json_data = { test: 'success' };
  next();
}, jsonResponse);

router.post('/upload_attachment.json', userParser, upload.disk.single('file'), (req, res, next) => {
  const { authUser } = req;
  if (!req.file || !req.file.destination) {
    res.json_error_code = ERROR.UPLOAD_NOFILE.code;
    res.json_error = ERROR.UPLOAD_NOFILE.message;
    next();
    return;
  }
  res.json_data = {
    staticPath: UPLOAD_STATIC_PATH,
    url: `/${authUser.id}/${req.file.filename}`,
  };
  next();
}, jsonResponse);

export default router;
