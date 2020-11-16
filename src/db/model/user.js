/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import Sequelize from 'sequelize';
import uuidAPIKey from 'uuid-apikey';

const { Model } = Sequelize;

class User extends Model {
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
    // twitter
    twitterId: {
      type: Sequelize.STRING,
    },
    twitterInfo: {
      type: Sequelize.STRING,
    },
    // telegram
    telegramId: {
      type: Sequelize.STRING,
    },
    telegramInfo: {
      type: Sequelize.STRING,
    },
    // youTube
    youTubeId: {
      type: Sequelize.STRING,
    },
    youTubeInfo: {
      type: Sequelize.STRING,
    },
    // wechat
    wechatId: {
      type: Sequelize.STRING,
    },
    wechatInfo: {
      type: Sequelize.STRING,
    },
    // weibo
    weiboId: {
      type: Sequelize.STRING,
    },
    weiboInfo: {
      type: Sequelize.STRING,
    },
    // github
    githubId: {
      type: Sequelize.STRING,
    },
    githubInfo: {
      type: Sequelize.STRING,
    },
    // google
    googleId: {
      type: Sequelize.STRING,
    },
    googleInfo: {
      type: Sequelize.STRING,
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
