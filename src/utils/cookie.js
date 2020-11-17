const cookieName = (key) => `${process.env.COOKIE_PREFIX}__${key}`;

function getCookieValue(req, key) {
  return req.signedCookies[cookieName(key)];
}

function setCookieValue(res, key, value, options = {}) {
  res.cookie(cookieName(key), value, { ...options, signed: true });
}

export {
  cookieName,
  getCookieValue,
  setCookieValue,
};
