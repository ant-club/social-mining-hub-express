import express from 'express';
import jsonResponse from '../middlewares/jsonResponse';

const router = express.Router();

/* GET home page. */
router.get('/t.json', (req, res, next) => {
  res.json_data = { test: 'success' };
  next();
}, jsonResponse);

export default router;
