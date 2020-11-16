import express from 'express';
import passport from 'passport';
import jsonResponse from '@middlewares/jsonResponse';
import argsCheck from '@middlewares/argsCheck';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import { Models } from '@db/index';

const router = express.Router();
const { User } = Models;

const AUTH_FAIL_REDIRECT = '/test/#/auth_fail';
const AUTH_SUCCESS_REDIRECT = '/test/#/auth_success';

/* GET home page. */
router.get('/facebook', argsCheck('address'), (req, res, next) => {
  res.cookie('auth_info', JSON.stringify({
    address: req.query.address,
    provider: 'facebook',
  }));
  next();
}, passport.authenticate('facebook'));
router.get('/facebook/callback', (req, res, next) => {
  if (!req.cookies.auth_info) {
    res.redirect(AUTH_FAIL_REDIRECT);
    return;
  }
  try {
    const authInfo = JSON.parse(req.cookies.auth_info);
  } catch (error) {
    res.redirect(AUTH_FAIL_REDIRECT);
    return;
  }
  passport.authenticate('facebook', (err, user, info) => {
    if (!user) {
      // 授权失败
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    res.redirect(AUTH_SUCCESS_REDIRECT);
  })(req, res, next);
});

export default router;
