import express from 'express';
import jsonResponse from '@middlewares/jsonResponse';
import varsProvider from '@middlewares/varsProvider';
import { toChecksumAddress } from 'ethereum-checksum-address';
import ERROR from '@const/ERROR.json';
import { Models } from '@db/index';
import { isEthAddress } from '@utils/eth';

const router = express.Router();
const { User } = Models;

/* GET home page. */
router.get('/:address.json', (req, res, next) => {
  const { address } = req.params;

  if (!isEthAddress(address)) {
    res.json_error_code = ERROR.USER.ADDRESS_FORMAT_ERR.code;
    res.json_error = ERROR.USER.ADDRESS_FORMAT_ERR.message;
    next();
    return;
  }
  User.findOrCreate({
    where: { address: toChecksumAddress(address) },
    defaults: { address: toChecksumAddress(address) },
  }).then(([user]) => {
    res.json_data = user.getData();
    next();
  });
}, jsonResponse);

export default router;
