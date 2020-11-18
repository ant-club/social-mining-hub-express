/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import Sequelize from 'sequelize';
import uuidAPIKey from 'uuid-apikey';

const { Model } = Sequelize;

const SOCIAL_ACCOUNT_PROVIDER = {
  twitter: 'twitter',
  telegram: 'telegram',
  youtube: 'youtube',
  wechat: 'wechat',
  weibo: 'weibo',
  github: 'github',
  google: 'google',
  medium: 'medium',
  facebook: 'facebook',
};

const provider = Object.values(SOCIAL_ACCOUNT_PROVIDER);

class SocialAccount extends Model {
  getData() {
    const ret = {
      apikey: this.apikey,
      uuid: this.uuid,
      address: this.address,
      email: this.email,
    };
    return ret;
  }
}

function model(sequelize) {
  SocialAccount.init({
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    provider: {
      type: Sequelize.ENUM(...provider),
      allowNull: false,
    },
    accountId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profileUrl: {
      type: Sequelize.STRING(1000),
    },
    info: {
      type: Sequelize.STRING(3000),
    },
  }, {
    indexes: [{
      unique: true,
      fields: ['userId', 'provider'],
      name: 'ids',
    }],
    sequelize,
    modelName: 'social_account',
    hooks: {
      beforeValidate: (instance) => {
        const key = uuidAPIKey.create();
        instance.uuid = key.uuid;
        instance.apikey = key.apiKey;
      },
    },
  });
  return SocialAccount;
}

export default model;
export {
  SOCIAL_ACCOUNT_PROVIDER,
};
