import express from 'express';

const router = express.Router();

function reactHandler(req, res) {
  if (process.env.NODE_ENV === 'DEV') {
    res.render('index_dev');
    return;
  }
  res.render('index', {
    hash: process.env.STATIC_HASH,
  });
}

/* GET home page. */
router.get('/', reactHandler);
router.get('/missions', reactHandler);
router.get('/mission/:id', reactHandler);

export default router;
