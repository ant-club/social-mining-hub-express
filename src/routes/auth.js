/* eslint-disable no-underscore-dangle */
import express from 'express';
import passport from 'passport';
import jsonResponse from '@middlewares/jsonResponse';
import argsCheck from '@middlewares/argsCheck';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import { getCookieValue, setCookieValue } from '@utils/cookie';
import { Models, SOCIAL_ACCOUNT_PROVIDER } from '@db/index';
import fetch from '@utils/fetch';

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

// facebook
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

// medium
router.get('/medium', argsCheck('token'), (req, res) => {
  const { token } = req.query;
  const address = getCookieValue(req, 'auth_address');
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    fetch.get('https://api.medium.com/v1/me', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
      },
    }).then((resp) => {
      const { data } = resp;
      if (data.errors) {
        res.redirect(AUTH_FAIL_REDIRECT);
        return;
      }
      user.addSocialAccount(
        SOCIAL_ACCOUNT_PROVIDER.medium,
        data.data.id,
        data.data.name,
        data.data.url,
        data.data,
      ).then((raw) => {
        if (raw) {
          res.redirect(AUTH_SUCCESS_REDIRECT);
        } else {
          res.redirect(AUTH_FAIL_REDIRECT);
        }
      });
    });
  }).catch(() => {
    res.redirect(AUTH_FAIL_REDIRECT);
  });
});

// github
router.get('/github', (req, res, next) => {
  const address = getCookieValue(req, 'auth_address');
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    setCookieValue(res, 'auth_info', {
      address,
      provider: SOCIAL_ACCOUNT_PROVIDER.github,
    });
    next();
  }).catch(() => {
    res.redirect(AUTH_FAIL_REDIRECT);
  });
}, passport.authenticate('github', { scope: ['read:user', 'user:email'] }));

router.get('/github/callback', (req, res, next) => {
  const authInfo = getCookieValue(req, 'auth_info');
  const {
    address,
    provider,
  } = authInfo;
  if (!authInfo || provider !== SOCIAL_ACCOUNT_PROVIDER.github) {
    res.redirect(AUTH_FAIL_REDIRECT);
    return;
  }
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    passport.authenticate('github', { scope: ['user_link', 'email'] }, (err, account) => {
      if (!user) {
        // 授权失败
        res.redirect(AUTH_FAIL_REDIRECT);
        return;
      }
      user.addSocialAccount(
        SOCIAL_ACCOUNT_PROVIDER.github,
        account.id,
        account.username,
        account.profileUrl,
        {
          emails: account.emails,
          photos: account.photos,
          json: account._json,
        },
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

// google
router.get('/google', (req, res, next) => {
  const address = getCookieValue(req, 'auth_address');
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    setCookieValue(res, 'auth_info', {
      address,
      provider: SOCIAL_ACCOUNT_PROVIDER.google,
    });
    next();
  }).catch(() => {
    res.redirect(AUTH_FAIL_REDIRECT);
  });
}, passport.authenticate('google'));

router.get('/google/callback', (req, res, next) => {
  const authInfo = getCookieValue(req, 'auth_info');
  const {
    address,
    provider,
  } = authInfo;
  if (!authInfo || provider !== SOCIAL_ACCOUNT_PROVIDER.google) {
    res.redirect(AUTH_FAIL_REDIRECT);
    return;
  }
  User.findAddress(address).then((user) => {
    if (!user) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    passport.authenticate('google', (err, account) => {
      if (!user) {
        // 授权失败
        res.redirect(AUTH_FAIL_REDIRECT);
        return;
      }
      res.redirect(AUTH_SUCCESS_REDIRECT);
      user.addSocialAccount(
        SOCIAL_ACCOUNT_PROVIDER.google,
        account.id,
        account.displayName,
        null,
        account._json,
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
