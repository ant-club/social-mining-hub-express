import { getCookieValue, setCookieValue } from '@utils/cookie';
import { Models } from '../db';

const { User } = Models;
const EXP_TIMESPAN = 60 * 60 * 1000;

const COOKIE_KEY = 'auth_user';

function updateLoginCookie(res, address) {
  setCookieValue(res, COOKIE_KEY, {
    address,
    nonce: new Date().getTime(),
  });
}

function userParser(req, res, next) {
  const userCookie = getCookieValue(req, COOKIE_KEY);

  if (!userCookie) {
    res.status(401).end('auth token needed');
    return;
  }

  const {
    address,
    nonce,
  } = userCookie;

  const newNonce = new Date().getTime();
  if (newNonce < nonce || (newNonce - nonce) > EXP_TIMESPAN) {
    res.status(401).end('auth token expired');
    return;
  }

  User.findOne({
    where: { address },
  }).then((user) => {
    if (!user) {
      res.status(401).end('auth token not exsit');
      return;
    }
    req.authUser = user;
    updateLoginCookie(res, address);
    next();
  });
}

function withSocialAccounts(req, res, next) {
  const userCookie = getCookieValue(req, COOKIE_KEY);

  if (!userCookie) {
    res.status(401).end('auth token needed');
    return;
  }

  const {
    address,
    nonce,
  } = userCookie;

  const newNonce = new Date().getTime();
  if (newNonce < nonce || (newNonce - nonce) > EXP_TIMESPAN) {
    res.status(401).end('auth token expired');
    return;
  }

  User.findOne({
    where: { address },
    include: ['socialAccounts'],
  }).then((user) => {
    if (!user) {
      res.status(401).end('auth token not exsit');
      return;
    }
    req.authUser = user;
    updateLoginCookie(res, address);
    next();
  });
}

userParser.withSocialAccounts = withSocialAccounts;

export default userParser;
export {
  updateLoginCookie,
};
