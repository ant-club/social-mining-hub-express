import express from 'express';
import jsonResponse from '@middlewares/jsonResponse';
import userParser, { updateLoginCookie } from '@middlewares/userParser';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import DB from '@const/DB.json';
import { Models } from '@db/index';
import { isEthAddress } from '@utils/eth';
import * as ethUtil from 'ethereumjs-util';
import * as sigUtil from 'eth-sig-util';
import argsCheck from '@middlewares/argsCheck';
import { getCookieValue, setCookieValue } from '@utils/cookie';

const router = express.Router();
const { User, UserSubMission, SubMission, Mission } = Models;

const LOGIN_MESSAGE = '[%nonce] I will login Ant Club for ONE time';

router.get('/user_login_token.json', (req, res, next) => {
  res.json_data = {
    message: LOGIN_MESSAGE,
    nonce: new Date().getTime(),
  };
  next();
}, jsonResponse);

router.post('/user_login.json', argsCheck('address', 'nonce', 'sig'), (req, res, next) => {
  const {
    address,
    nonce,
    sig,
  } = req.body;

  if (!isEthAddress(address)) {
    res.status(401);
    res.json_error_code = ERROR.USER.ADDRESS_FORMAT_ERR.code;
    res.json_error = ERROR.USER.ADDRESS_FORMAT_ERR.message;
    next();
    return;
  }

  const token = LOGIN_MESSAGE.replace('%nonce', nonce);
  const data = ethUtil.bufferToHex(Buffer.from(token, 'utf8'));
  const recovered = sigUtil.recoverPersonalSignature({
    data,
    sig,
  });
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    res.status(401);
    res.json_error_code = ERROR.USER.ADDRESS_FORMAT_ERR.code;
    res.json_error = ERROR.USER.ADDRESS_FORMAT_ERR.message;
    next();
    return;
  }

  User.findOrCreate({
    where: { address: toChecksumAddress(address) },
    defaults: { address: toChecksumAddress(address) },
  }).then(([user]) => {
    res.json_data = true;
    updateLoginCookie(res, user.address);
    next();
  });
}, jsonResponse);

router.get('/user/me.json', userParser.withSocialAccounts, (req, res, next) => {
  res.json_data = req.authUser.getData();
  next();
}, jsonResponse);

router.post('/user/me.json', userParser, (req, res, next) => {
  const { authUser } = req;

  const data = req.body || {};
  authUser.update(data).then((user) => {
    res.json_data = user.getData();
    next();
  });
}, jsonResponse);

router.get('/user/mission/:id.json', userParser, (req, res, next) => {
  const { authUser } = req;
  const { params } = req;
  const { id } = params;

  UserSubMission.findAll({
    include: [{
      model: User,
      where: { id: authUser.id },
      as: 'user',
    }, {
      model: SubMission,
      include: [{
        model: Mission,
        where: { id },
        as: 'mission',
      }],
      as: 'subMission',
    }],
  }).then((userSubMissions) => {
    res.json_data = userSubMissions.map((m) => {
      const data = m.getData();
      delete data.user;
      delete data.subMission;
      return data;
    });
    next();
  });
}, jsonResponse);

router.post('/user/sub_mission/:id.json', userParser.withSocialAccounts, argsCheck('link', 'image'), (req, res, next) => {
  const { authUser } = req;
  const { params } = req;
  const { id } = params;
  const { link, image } = req.body;

  // 判断任务是否结束，判断用户是否绑定指定账户
  SubMission.findByPk(id, { include: ['mission'] }).then((instance) => {
    if (!instance) {
      res.status(404).end();
      return;
    }
    if (instance.mission.state !== DB.MISSION_STATE.progressing) {
      res.json_error_code = ERROR.USER.MISSION_STATE_ERR.code;
      res.json_error = ERROR.USER.MISSION_STATE_ERR.message;
      next();
      return;
    }
    const userData = authUser.getData();
    const socialAccount = (userData.socialAccounts || {})[instance.provider];
    if (!socialAccount) {
      res.json_error_code = ERROR.USER.MISSION_NO_ACCOUNT_ERR.code;
      res.json_error = ERROR.USER.MISSION_NO_ACCOUNT_ERR.message;
      next();
      return;
    }
    UserSubMission.create({
      userId: authUser.id,
      subMissionId: id,
      link,
      image,
    }).then((subMission) => {
      res.json_data = subMission.getData();
      next();
    });
  });
}, jsonResponse);

export default router;
