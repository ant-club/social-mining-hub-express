/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import Sequelize, { STRING } from 'sequelize';
import uuidAPIKey from 'uuid-apikey';
import { toChecksumAddress } from 'ethereum-checksum-address';
import { isEthAddress } from '@utils/eth';

const { Model } = Sequelize;

const { UPLOAD_STATIC_PATH } = process.env;

class User extends Model {
  static findAddress(address) {
    if (!isEthAddress(address)) {
      return Promise.reject();
    }
    return User.findOne({
      where: {
        address: toChecksumAddress(address),
      },
    });
  }

  addSocialAccount(provider, accountId, displayName, profileUrl, info) {
    const { sequelize } = User;
    const SocialAccount = sequelize.model('social_account');
    return SocialAccount.create({
      userId: this.id,
      provider,
      accountId,
      displayName,
      profileUrl,
      info: info ? JSON.stringify(info) : null,
    });
  }

  getData() {
    const ret = {
      apikey: this.apikey,
      uuid: this.uuid,
      address: this.address,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar ? UPLOAD_STATIC_PATH + this.avatar : null,
      stateCode: this.stateCode,
      language: this.language,
      description: this.description,
    };
    if (this.socialAccounts) {
      ret.socialAccounts = this.socialAccounts.map((c) => c.getData()).reduce((a, b) => {
        a[b.provider] = {
          displayName: b.displayName,
          profileUrl: b.profileUrl,
        };
        return a;
      }, {});
    }
    return ret;
  }
}

function model(sequelize) {
  User.init({
    // api
    apikey: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // 地址
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    // email
    email: {
      type: Sequelize.STRING,
    },
    // 显示的名字
    displayName: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    stateCode: {
      type: Sequelize.STRING(3),
    },
    language: {
      type: Sequelize.ENUM('zh-cn', 'en', 'jp', 'kr', 'ru'),
    },
    description: {
      type: Sequelize.STRING(1000),
    },
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeValidate: (instance) => {
        const key = uuidAPIKey.create();
        instance.uuid = key.uuid;
        instance.apikey = key.apiKey;
      },
    },
  });
  return User;
}

export default model;
