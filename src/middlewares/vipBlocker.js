import ERROR from '../const/ERROR.json';

function vipBlocker(req, res, next) {
  const { jwt_user } = req;
  if (!jwt_user.isVip()) {
    res.send({
      success: false,
      error: {
        code: ERROR.NOT_VIP.code,
        message: ERROR.NOT_VIP.message,
      },
    });
    return;
  }
  next();
}

export default vipBlocker;
