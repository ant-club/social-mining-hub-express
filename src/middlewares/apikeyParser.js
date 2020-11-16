import { Models } from '../db';

const { Apikey } = Models;

function apikeyParser(req, res, next) {
  const apikey = req.get('x-api-key');

  if (!apikey || apikey.length < 10) {
    res.status(401).end('Access apikey needed');
    return;
  }
  try {
    Apikey.findOne({
      where: { apikey },
    }).then((ak) => {
      if (!ak) {
        res.status(401).end('Access apikey not exsit');
        return;
      }
      req.apikey = ak;
      next();
    }).catch(() => {
      res.status(401).end('Cannot find access apikey');
    });
  } catch (err) {
    res.status(401).end('Access apikey parse failed');
  }
}

export default apikeyParser;
