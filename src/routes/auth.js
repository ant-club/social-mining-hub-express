import express from 'express';
import passport from 'passport';
import jsonResponse from '@middlewares/jsonResponse';
import argsCheck from '@middlewares/argsCheck';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import { getCookieValue, setCookieValue } from '@utils/cookie';
import { Models, SOCIAL_ACCOUNT_PROVIDER } from '@db/index';

const router = express.Router();
const { User } = Models;

const AUTH_FAIL_REDIRECT = '/test/#/auth_fail';
const AUTH_SUCCESS_REDIRECT = '/test/#/auth_success';

// TODO: JSON POST API鉴权地址
router.get('/token', argsCheck('address'), (req, res, next) => {
  // TODO: 需要检查是否存在地址
  setCookieValue(res, 'auth_address', req.query.address);
  next();
});

/* GET home page. */
router.get('/facebook', (req, res, next) => {
  const address = getCookieValue(req, 'auth_address');
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    setCookieValue(res, 'auth_info', {
      address,
      provider: SOCIAL_ACCOUNT_PROVIDER.facebook,
    });
    next();
  }).catch(() => {
    res.redirect(AUTH_FAIL_REDIRECT);
  });
}, passport.authenticate('facebook', { scope: ['user_link', 'email'] }));
router.get('/facebook/callback', (req, res, next) => {
  const authInfo = getCookieValue(req, 'auth_info');
  const {
    address,
    provider,
  } = authInfo;
  if (!authInfo || provider !== SOCIAL_ACCOUNT_PROVIDER.facebook) {
    res.redirect(AUTH_FAIL_REDIRECT);
    return;
  }
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    passport.authenticate('facebook', { scope: ['user_link', 'email'] }, (err, account) => {
      if (!user) {
        // 授权失败
        res.redirect(AUTH_FAIL_REDIRECT);
        return;
      }
      user.addSocialAccount(
        SOCIAL_ACCOUNT_PROVIDER.facebook,
        account.id,
        account.displayName,
        account.profileUrl,
      ).then((raw) => {
        if (raw) {
          res.redirect(AUTH_SUCCESS_REDIRECT);
        } else {
          res.redirect(AUTH_FAIL_REDIRECT);
        }
      });
    })(req, res, next);
  }).catch(() => {
    res.redirect(AUTH_FAIL_REDIRECT);
  });
});

export default router;
