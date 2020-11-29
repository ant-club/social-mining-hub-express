/* eslint-disable no-underscore-dangle */
import express from 'express';
import passport from 'passport';
import jsonResponse from '@middlewares/jsonResponse';
import argsCheck from '@middlewares/argsCheck';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import userParser from '@middlewares/userParser';
import { getCookieValue, setCookieValue } from '@utils/cookie';
import { Models } from '@db/index';
import DB from '@const/DB.json';
import fetch from '@utils/fetch';

const router = express.Router();
const { User } = Models;

const AUTH_FAIL_REDIRECT = '/auth_fail.html';
const AUTH_SUCCESS_REDIRECT = '/auth_success.html';

// TODO: JSON POST API鉴权地址
router.get('/token', argsCheck('address'), (req, res, next) => {
  // TODO: 需要检查是否存在地址
  setCookieValue(res, 'auth_address', req.query.address);
  next();
});

// facebook
router.get('/facebook', userParser, passport.authenticate('facebook', { scope: ['user_link', 'email'] }));
router.get('/facebook/callback', userParser, (req, res, next) => {
  const { authUser } = req;
  passport.authenticate('facebook', { scope: ['user_link', 'email'] }, (err, account) => {
    if (!account) {
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    authUser.addSocialAccount(
      DB.SOCIAL_ACCOUNT_PROVIDER.facebook,
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
});

// medium
router.get('/medium', userParser, argsCheck('token'), (req, res) => {
  const { authUser } = req;
  const { token } = req.query;
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
    authUser.addSocialAccount(
      DB.SOCIAL_ACCOUNT_PROVIDER.medium,
      data.data.id,
      data.data.name,
      data.data.url,
      {
        ...data.data,
        token,
      },
    ).then((raw) => {
      if (raw) {
        res.redirect(AUTH_SUCCESS_REDIRECT);
      } else {
        res.redirect(AUTH_FAIL_REDIRECT);
      }
    });
  });
});

// github
router.get('/github', userParser, passport.authenticate('github', { scope: ['read:user', 'user:email'] }));
router.get('/github/callback', userParser, (req, res, next) => {
  const { authUser } = req;
  passport.authenticate('github', { scope: ['user_link', 'email'] }, (err, account) => {
    if (!account) {
      // 授权失败
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    authUser.addSocialAccount(
      DB.SOCIAL_ACCOUNT_PROVIDER.github,
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
});

// google
router.get('/google', userParser, passport.authenticate('google'));
router.get('/google/callback', userParser, (req, res, next) => {
  const { authUser } = req;
  passport.authenticate('google', (err, account) => {
    if (!account) {
      // 授权失败
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    authUser.addSocialAccount(
      DB.SOCIAL_ACCOUNT_PROVIDER.google,
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
});

// telegram
router.get('/telegram', userParser, (req, res) => {
  res.render('auth_telegram');
});
router.get('/telegram/callback', userParser, (req, res, next) => {
  const { authUser } = req;
  passport.authenticate('telegram', (err, account) => {
    if (!account) {
      // 授权失败
      res.redirect(AUTH_FAIL_REDIRECT);
      return;
    }
    authUser.addSocialAccount(
      DB.SOCIAL_ACCOUNT_PROVIDER.telegram,
      account.id,
      account.username,
      null,
      account,
    ).then((raw) => {
      if (raw) {
        res.redirect(AUTH_SUCCESS_REDIRECT);
      } else {
        res.redirect(AUTH_FAIL_REDIRECT);
      }
    });
  })(req, res, next);
});

export default router;
