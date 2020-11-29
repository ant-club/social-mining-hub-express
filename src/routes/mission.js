import express from 'express';
import jsonResponse from '@middlewares/jsonResponse';
import userParser, { updateLoginCookie } from '@middlewares/userParser';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import { Models } from '@db/index';
import { isEthAddress } from '@utils/eth';
import argsCheck from '@middlewares/argsCheck';
import { getCookieValue, setCookieValue } from '@utils/cookie';
import { Op } from 'sequelize';

const router = express.Router();
const { Mission } = Models;

router.get('/missions.json', (req, res, next) => {
  Mission.findAll({
    where: {
      startAt: {
        [Op.lt]: new Date(),
      },
      endAt: {
        [Op.gt]: new Date(),
      },
    },
  }).then((missions) => {
    res.json_data = missions.map((m) => m.getData());
    next();
  });
}, jsonResponse);

router.get('/mission/:id.json', (req, res, next) => {
  const { params } = req;
  const { id } = params;
  Mission.findByPk(id, {
    include: ['subMissions'],
  }).then((mission) => {
    res.json_data = mission.getData();
    next();
  });
}, jsonResponse);

export default router;
